import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Shiprocket Webhook Handler
 * Endpoint: /api/webhooks/shiprocket
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('Shiprocket Webhook Received:', payload);

    // Verify security token
    const authHeader = req.headers.get('x-api-key');
    const expectedToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    if (expectedToken && authHeader !== expectedToken) {
      console.warn('Unauthorized Shiprocket Webhook attempt blocked.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { event, order_id, awb } = payload;

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Map Shiprocket events to our Prisma OrderStatus enum
    // enum OrderStatus: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED
    let localStatus = null;

    switch (event.toLowerCase()) {
      case 'delivered':
        localStatus = 'DELIVERED';
        break;
      case 'shipment_dispatch':
      case 'shipped':
      case 'out_for_delivery':
      case 'in_transit':
        localStatus = 'SHIPPED';
        break;
      case 'canceled':
        localStatus = 'CANCELLED';
        break;
      case 'return_received':
        localStatus = 'RETURNED';
        break;
      case 'ndr':
        console.warn(`NDR (Non-Delivery Report) received for order ${order_id}. Manual intervention may be required.`);
        break;
    }

    if (localStatus) {
      await prisma.order.update({
        where: { orderNumber: order_id },
        data: { 
          status: localStatus as any,
          awbNumber: awb || undefined
        }
      });
      console.log(`Order ${order_id} status updated to ${localStatus} via Webhook.`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Shiprocket Webhook Error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
