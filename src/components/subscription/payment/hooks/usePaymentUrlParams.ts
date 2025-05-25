import { debugLog } from '@/lib/logger';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePaymentProcessing } from './usePaymentProcessing';

export const usePaymentUrlParams = (
  onPaymentComplete: () => void,
  setIsLoading: (val: boolean) => void
) => {
  const { verifyPaymentAndCompleteRegistration, retrieveAndProcessRegistrationData } = usePaymentProcessing();

  useEffect(() => {
    // Check if there's stored payment data from a postMessage success
    const paymentDataString = sessionStorage.getItem('payment_success_data');
    if (paymentDataString) {
      try {
        const paymentData = JSON.parse(paymentDataString);
        debugLog('Found stored payment data:', paymentData);
        
        // Only process recently stored data (within last 5 minutes)
        const timestamp = new Date(paymentData.timestamp).getTime();
        const now = new Date().getTime();
        const fiveMinutesInMs = 5 * 60 * 1000;
        
        if (now - timestamp < fiveMinutesInMs) {
          // If we have a registration ID, verify the payment with the backend
          const regId = localStorage.getItem('temp_registration_id');
          if (regId) {
            debugLog('Found registration ID, verifying payment:', regId);
            verifyPaymentAndCompleteRegistration(regId, onPaymentComplete, setIsLoading);
          } else {
            debugLog('No registration ID found, completing payment directly');
            onPaymentComplete();
          }
          
          // Clear the stored payment data
          sessionStorage.removeItem('payment_success_data');
          
          // IMPORTANT: Clear registration data to prevent "complete registration" messages
          sessionStorage.removeItem('registration_data');
        }
      } catch (error) {
        console.error('Error processing stored payment data:', error);
      }
    }
    
    // Always check for temp registration ID in localStorage
    const storedRegId = localStorage.getItem('temp_registration_id');
    if (storedRegId) {
      debugLog('Found stored registration ID:', storedRegId);
      retrieveAndProcessRegistrationData(storedRegId, onPaymentComplete);
    }
    
    // Listen for payment messages from the iframe
    const handlePaymentMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        'https://secure.cardcom.solutions',
        window.location.origin
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn(
          `Ignored message from unauthorized origin: ${event.origin}`
        );
        return;
      }

      debugLog('Received message:', event.data);
      
      if (event.data?.type === 'cardcom-paid') {
        debugLog('Payment successful:', event.data.details);
        
        // Store the payment data in sessionStorage for later validation
        if (event.data?.details) {
          sessionStorage.setItem('payment_success_data', JSON.stringify({
            ...event.data.details,
            timestamp: new Date().toISOString()
          }));
        }
        
        toast.success('התשלום התקבל בהצלחה!');
        
        // If we have a registration ID, verify the payment with the backend
        const regId = localStorage.getItem('temp_registration_id');
        if (regId) {
          debugLog('Verifying payment with registration ID:', regId);
          verifyPaymentAndCompleteRegistration(regId, onPaymentComplete, setIsLoading);
        } else {
          debugLog('Completing payment without registration ID');
          onPaymentComplete();
        }
        
        // Clear registration data to prevent "complete registration" messages
        sessionStorage.removeItem('registration_data');
      } else if (event.data?.type === 'cardcom-error') {
        console.error('Payment error:', event.data.message);
        toast.error('שגיאה בתהליך התשלום: ' + (event.data.message || 'אנא נסה שנית'));
      }
    };
    
    window.addEventListener('message', handlePaymentMessage);
    return () => window.removeEventListener('message', handlePaymentMessage);
  }, [onPaymentComplete, setIsLoading, verifyPaymentAndCompleteRegistration, retrieveAndProcessRegistrationData]);
};
