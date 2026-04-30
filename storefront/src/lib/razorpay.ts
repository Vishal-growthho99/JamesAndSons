import Razorpay from 'razorpay';

let razorpayInstance: any = null;

function getRazorpayInstance() {
  if (razorpayInstance) return razorpayInstance;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are missing in environment variables.');
  }

  razorpayInstance = new Razorpay({ key_id, key_secret });
  return razorpayInstance;
}

/**
 * Creates a new Razorpay Order
 */
export async function createRazorpayOrder(amount: number, receipt: string) {
  try {
    const rzp = getRazorpayInstance();
    const order = await rzp.orders.create({
      amount: Math.round(amount),
      currency: 'INR',
      receipt: receipt,
      payment_capture: true,
    });
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Failed:', error);
    throw error;
  }
}
