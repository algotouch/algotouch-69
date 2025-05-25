
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TokenData } from '@/types/payment';
import { getSubscriptionPlans } from '../utils/paymentHelpers';
import { useRegistrationData } from './useRegistrationData';
import {
  handleExistingUserPayment,
  registerNewUser,
  initiateExternalPayment
} from '../services/paymentService';
import { UsePaymentProcessProps, PaymentError } from './types';
import { usePaymentErrorHandling } from './usePaymentErrorHandling';
import { supabase } from '@/lib/supabase-client';

export const usePaymentProcess = ({ planId, onPaymentComplete }: UsePaymentProcessProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
  
  const { 
    registrationData, 
    registrationError, 
    loadRegistrationData,
    updateRegistrationData,
    clearRegistrationData
  } = useRegistrationData();

  const planDetails = getSubscriptionPlans();
  const plan = planId === 'annual' 
    ? planDetails.annual 
    : planId === 'vip' 
      ? planDetails.vip 
      : planDetails.monthly;

  const { handleError, checkForRecovery, isRecovering, sessionId } = usePaymentErrorHandling({
    planId,
    onCardUpdate: () => navigate('/subscription?step=update-card'),
    onAlternativePayment: () => navigate('/subscription?step=alternative-payment')
  });

  useEffect(() => {
    const checkRecovery = async () => {
      const recoveryData = await checkForRecovery();
      if (recoveryData) {
        toast.info('נמצאו פרטים להשלמת התשלום');
        
        if (recoveryData.planId && recoveryData.planId !== planId) {
          navigate(`/subscription?step=3&plan=${recoveryData.planId}&recover=${sessionId}`);
        }
      }
    };
    
    checkRecovery();
  }, []);

  const handlePaymentProcessing = async (tokenData: TokenData) => {
    // Define operationTypeValue at the beginning of the function to ensure it's available throughout
    let operationTypeValue = 3; // Default: token creation only (for monthly subscription with free trial)
    
    if (planId === 'annual') {
      operationTypeValue = 2; // Charge and create token for recurring annual payments
    } else if (planId === 'vip') {
      operationTypeValue = 1; // Charge only - one-time payment
    }
    
    try {
      setIsProcessing(true);
      setPaymentError(null);
      
      if (user) {
        // Persist token server-side for security
        await supabase.functions.invoke('process-payment-data', {
          body: {
            paymentData: {
              Operation: 'CreateTokenOnly',
              TokenInfo: {
                Token: tokenData.token,
                TokenExDate: `${tokenData.expiryYear}${tokenData.expiryMonth}01`
              },
              TranzactionInfo: {
                Last4CardDigits: tokenData.lastFourDigits,
                CardMonth: Number(tokenData.expiryMonth),
                CardYear: Number(tokenData.expiryYear),
                CardName: tokenData.cardholderName,
                Amount: plan.price
              },
              TranzactionId: `manual_${Date.now()}`,
              LowProfileId: `manual_${Date.now()}`
            },
            userId: user.id,
            source: 'client-payment-process'
          }
        });

        await handleExistingUserPayment(user.id, planId, tokenData, operationTypeValue, planDetails);
      } else if (registrationData) {
        const updatedData = {
          ...registrationData,
          planId
        };

        updateRegistrationData(updatedData);

        if (updatedData.email && updatedData.password) {
          await registerNewUser(updatedData, tokenData);
        }
      } else {
        const tempRegId = `temp_reg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem('temp_registration_id', tempRegId);

        const minimalRegData = {
          planId,
          registrationTime: new Date().toISOString()
        };

        sessionStorage.setItem('registration_data', JSON.stringify(minimalRegData));

        toast.success('התשלום התקבל בהצלחה! נא להשלים את תהליך ההרשמה.');
      }
      
      onPaymentComplete();
    } catch (error: any) {
      console.error("Payment processing error:", error);
      
      const errorInfo = await handleError(error, {
        tokenData,
        planId,
        operationType: operationTypeValue
      });
      
      const paymentError: PaymentError = new Error(errorInfo?.errorMessage || 'שגיאה לא ידועה בתהליך התשלום');
      paymentError.code = errorInfo?.errorCode;
      paymentError.details = errorInfo;
      
      setPaymentError(paymentError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, cardData: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
  }) => {
    e.preventDefault();
    
    const { cardNumber, cardholderName, expiryDate, cvv } = cardData;
    
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      toast.error('נא למלא את כל פרטי התשלום');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const tokenData: TokenData = {
        token: `sim_${Date.now()}`,
        lastFourDigits: cardNumber.replace(/\s/g, '').slice(-4),
        expiryMonth: expiryDate.split('/')[0],
        expiryYear: `20${expiryDate.split('/')[1]}`,
        cardholderName
      };
      
      await handlePaymentProcessing(tokenData);
    } catch (error: any) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExternalPayment = async () => {
    // Define operationTypeValue at the beginning of this function for its scope
    let operationTypeValue = 3; // Default: token creation only
    
    if (planId === 'annual') {
      operationTypeValue = 2; // Charge and create token for recurring payments
    } else if (planId === 'vip') {
      operationTypeValue = 1; // Charge only - one-time payment
    }
    
    setIsProcessing(true);
    try {
      const data = await initiateExternalPayment(planId, user, registrationData);
      
      if (data.tempRegistrationId) {
        localStorage.setItem('temp_registration_id', data.tempRegistrationId);
      }
      
      window.location.href = data.url;
    } catch (error: any) {
      const errorInfo = await handleError(error, {
        planId,
        operationType: operationTypeValue,
        userInfo: user ? { userId: user.id, email: user.email } : null
      });
      
      const paymentError: PaymentError = new Error(errorInfo?.errorMessage || 'שגיאה ביצירת עסקה');
      setPaymentError(paymentError);
      
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    registrationData,
    registrationError,
    paymentError,
    loadRegistrationData,
    handleSubmit,
    handleExternalPayment,
    isRecovering,
    plan
  };
};
