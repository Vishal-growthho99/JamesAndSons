'use server';

import { prisma } from '@/lib/prisma';

type CartItem = {
  product: {
    id: string;
    name: string;
    d2cPrice: number;
    mrp: number;
    gstRate: number;
  };
  quantity: number;
};

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

import { createRazorpayOrder } from '@/lib/razorpay';

export async function createOrder(
  form: CheckoutForm,
  cartItems: CartItem[],
  subtotal: number,
  gst: number,
  shipping: number
) {
  try {
    let user = await prisma.user.findUnique({ where: { email: form.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: form.email,
          firstName: form.name.split(' ')[0] || form.name,
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          password: 'guest',
          phone: form.phone,
          role: 'CUSTOMER',
        },
      });
    }

    const shippingAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
    const orderNumber = `JNS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
    const totalAmount = subtotal + gst + shipping;

    // 1. Create order as PENDING
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING',
        totalAmount,
        taxAmount: gst,
        shippingAmount: shipping,
        shippingAddress,
        billingAddress: shippingAddress,
        items: {
          create: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.d2cPrice,
            total: item.product.d2cPrice * item.quantity,
          })),
        },
      },
    });

    // 2. Generate Razorpay Order
    const rpOrder = await createRazorpayOrder(totalAmount * 100, order.id);

    // 3. Link Razorpay Order to Prisma
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rpOrder.id },
    });

    return { 
      success: true, 
      orderNumber: order.orderNumber, 
      orderId: order.id,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
  } catch (error: any) {
    console.error('Order creation error:', error);
    return { success: false, error: error.message };
  }
}

import crypto from 'crypto';

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  internalOrderId: string
) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      throw new Error('Invalid payment signature');
    }

    await prisma.order.update({
      where: { id: internalOrderId },
      data: {
        status: 'PAID',
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Payment verification failed:', error);
    return { success: false, error: error.message };
  }
}

import { checkPincodeServiceability } from '@/lib/shiprocket';

export async function validatePincodeDelivery(pincode: string) {
  // Default pickup zip or from ENV
  const pickupPincode = process.env.STORE_PICKUP_PINCODE || '110030';
  const result = await checkPincodeServiceability(pickupPincode, pincode, 5.0);
  return result;
}
