// In-memory token cache for serverless environments
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

export async function getShiprocketToken() {
  const now = Date.now();
  
  // If we have a valid token (with 5 mins buffer), reuse it
  if (cachedToken && now < tokenExpiryTime - 5 * 60 * 1000) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.warn('Shiprocket credentials missing from ENV');
    return null;
  }

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Shiprocket auth failed: ${res.statusText}`);
    }

    const data = await res.json();
    cachedToken = data.token;
    
    // Simplistic expiry: assume token is good for 9 days (Shiprocket tokens usually last 10)
    tokenExpiryTime = now + 9 * 24 * 60 * 60 * 1000; 
    
    return cachedToken;
  } catch (err) {
    console.error('getShiprocketToken Error:', err);
    return null;
  }
}

/**
 * Check if a given pincode is serviceable by Shiprocket
 */
export async function checkPincodeServiceability(pickupPostcode: string, deliveryPostcode: string, weightKg: number) {
  const token = await getShiprocketToken();
  if (!token) return { status: 0, message: 'Logistics service unavailable' };

  try {
    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&weight=${weightKg}&cod=0`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      }
    );

    const data = await res.json();
    if (data.status === 200 && data.data && data.data.available_courier_companies?.length > 0) {
      // Find the fastest/recommended courier
      const couriers = data.data.available_courier_companies;
      return { 
        status: 200, 
        serviceable: true,
        estimatedDeliveryDate: couriers[0].etd 
      };
    }
    
    return { status: 404, serviceable: false, message: 'Pincode not serviceable' };
  } catch (err) {
    console.error('Shiprocket Serviceability Error:', err);
    return { status: 500, serviceable: false, message: 'Logistics check failed' };
  }
}

/**
 * Creates a Shiprocket Custom Order
 */
export async function createShiprocketOrder(params: any) {
  const token = await getShiprocketToken();
  if (!token) return { success: false, message: 'Logistics service unavailable' };

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(params),
      cache: 'no-store'
    });

    const data = await res.json();
    
    if (data.status_code === 1 || data.order_id) {
      return { success: true, order_id: data.order_id, shipment_id: data.shipment_id };
    } else {
      console.error('Shiprocket Order Failed:', data);
      return { success: false, message: data.message || 'Creation failed' };
    }
  } catch (err) {
    console.error('createShiprocketOrder Error:', err);
    return { success: false, message: 'API Call Failed' };
  }
}
