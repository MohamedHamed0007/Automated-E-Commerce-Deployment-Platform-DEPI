import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '../../components/Button';
import { Lock } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripePaymentForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/user/paymentSuccess',
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="flex items-start gap-3 pt-4">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Secure Payment
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || processing}
        loading={processing}
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}
