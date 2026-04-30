import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * Creates a new Razorpay Order
 * @param amount Total amount IN PAISAE (e.g., ₹100 = 10000)
 * @param receipt Unique receipt ID (e.g., your internal order number)
 */
export async function createRazorpayOrder(amount: number, receipt: string) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount), // ensure integer
      currency: 'INR',
      receipt: receipt,
      payment_capture: true, // auto-capture
    });
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Failed:', error);
    throw error;
  }
}
