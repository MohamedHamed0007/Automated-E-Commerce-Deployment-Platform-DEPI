import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';

/**
 * Local Button component to resolve path issues and ensure 
 * the component is self-contained for the environment.
 */
const Button = ({ 
  children, 
  className = "", 
  disabled = false, 
  loading = false, 
  type = "button",
  ...props 
}: any) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 shadow-sm hover:shadow-md'}
        bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripePaymentForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !shipmentId) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Appends shipmentId to match the router exact path
        return_url: `${window.location.origin}/user/paymentSuccess/${shipmentId}`,
      },
      redirect: 'if_required', 
    });

    if (error) {
      onError(error.message || 'Payment failed');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setProcessing(false);
      onSuccess();
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Container for Stripe Card Inputs */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 min-h-[150px]">
        {/* Stripe natively handles the loading state of this element */}
        <PaymentElement />
      </div>
      
      {/* Security Information Section */}
      <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/50">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-800/40 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-bold text-green-900 dark:text-green-100 mb-0.5">
            Secure Payment
          </h4>
          <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
            Your transaction is encrypted. We do not store your full card details on our servers, ensuring your privacy and security.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-14"
        disabled={!stripe || processing}
        loading={processing}
      >
        {processing ? 'Processing...' : `Confirm & Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}