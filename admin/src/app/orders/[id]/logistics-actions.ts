'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { razorpay } from '@/lib/razorpay';
import { getShiprocketToken } from '@/lib/shiprocket';

export async function syncRazorpayPayment(orderId: string, razorpayOrderId: string) {
  try {
    const payments = await razorpay.orders.fetchPayments(razorpayOrderId);
    const capturedPayment = payments.items.find((p: any) => p.status === 'captured');

    if (capturedPayment) {
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: 'PAID',
          razorpayPaymentId: capturedPayment.id
        }
      });
      revalidatePath(`/orders/${orderId}`);
      return { success: true, status: 'PAID' };
    }

    return { success: false, error: 'No captured payment found in Razorpay' };
  } catch (error: any) {
    console.error('syncRazorpayPayment error:', error);
    return { success: false, error: error.message };
  }
}

export async function trackShiprocketShipment(awbNumber: string) {
  try {
    const token = await getShiprocketToken();
    if (!token) throw new Error('Shiprocket authentication failed');

    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbNumber}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    return { success: true, data: data.tracking_data };
  } catch (error: any) {
    console.error('trackShiprocketShipment error:', error);
    return { success: false, error: error.message };
  }
}

import { generateLabel, requestPickup } from '@/lib/shiprocket';

export async function generateOrderLabel(shipmentId: string) {
  try {
    const url = await generateLabel([parseInt(shipmentId)]);
    return { success: !!url, labelUrl: url };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function requestOrderPickup(shipmentId: string) {
  try {
    const result = await requestPickup([parseInt(shipmentId)]);
    revalidatePath('/orders/[id]', 'page');
    return { success: true, result };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

