import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { createShiprocketOrder } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid signature in Razorpay webhook');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    
    if (event === 'order.paid') {
      const rpOrderId = payload.payload.order.entity.id;
      
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: rpOrderId },
        include: { user: true, items: { include: { product: true } } }
      });

      if (order && order.status !== 'PAID') {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        });

        // Push to Shiprocket automatically
        try {
          // Parse address (assumes format: "Address, City, State - Pincode")
          const parts = order.shippingAddress.split(', ');
          const pincodeStr = parts.pop()?.split(' - ')[1] || '110030';
          const stateStr = parts.pop() || '';
          const cityStr = parts.pop() || '';
          const addrStr = parts.join(', ');

          const srParams = {
            order_id: order.orderNumber,
            order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            pickup_location: "Primary Warehouse", // Ensure this exists in Shiprocket dashboard
            billing_customer_name: order.user.firstName,
            billing_last_name: order.user.lastName,
            billing_address: addrStr,
            billing_city: cityStr,
            billing_pincode: pincodeStr,
            billing_state: stateStr,
            billing_country: "India",
            billing_email: order.user.email,
            billing_phone: order.user.phone || '9999999999',
            shipping_is_billing: true,
            order_items: order.items.map(item => ({
              name: item.product.name,
              sku: item.product.sku,
              units: item.quantity,
              selling_price: item.unitPrice,
            })),
            payment_method: "Prepaid",
            sub_total: order.totalAmount,
            length: 10,
            breadth: 10,
            height: 10,
            weight: 5.0
          };

          const srRes = await createShiprocketOrder(srParams);
          if (srRes.success) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                trackingNumber: String(srRes.shipment_id || ''),
                status: 'PROCESSING'
              }
            });
            console.log(`Order ${order.orderNumber} successfully pushed to Shiprocket.`);
          }
        } catch (srErr) {
          console.error(`Shiprocket push failed for ${order.orderNumber}`, srErr);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
