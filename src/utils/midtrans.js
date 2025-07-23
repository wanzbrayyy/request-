
import { config } from '@/config';

export const initMidtrans = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve(window.snap);
      return;
    }

    const script = document.createElement('script');
    script.src = config.midtrans.isProduction 
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', config.midtrans.clientKey);
    script.onload = () => resolve(window.snap);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const createPayment = async (orderData) => {
  try {
    // In a real app, this would call your backend
    // For demo, we'll simulate the payment token creation
    const paymentToken = `demo_token_${Date.now()}`;
    
    const snap = await initMidtrans();
    
    return new Promise((resolve, reject) => {
      snap.pay(paymentToken, {
        onSuccess: (result) => {
          resolve(result);
        },
        onPending: (result) => {
          resolve(result);
        },
        onError: (result) => {
          reject(result);
        },
        onClose: () => {
          reject(new Error('Payment cancelled'));
        }
      });
    });
  } catch (error) {
    throw error;
  }
};
