import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAppDispatch, useAppSelector } from "../../redux/hookredux";
import { createPaymentIntent } from "../../redux/thunk/paymentThunk";
import { getShipmentById } from "../../redux/thunk/shipmentThunk";
import StripePaymentForm from "../../components/StripePaymentForm/StripePaymentForm";
import toast from "react-hot-toast";

function PaymentContent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { clientSecret, loading, error } = useAppSelector((state) => state.payment);
  const { currentShipment } = useAppSelector((state) => state.shipment);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Initialize Stripe and Log Debug Info
  const stripePromise = useMemo(() => {
    const rawKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    // DEBUG LOGS - Check your browser console (F12)
    console.group("🔍 Stripe Key Debug");
    console.log("Raw Key Value:", rawKey);
    console.log("Type of Key:", typeof rawKey);
    console.log("Is Key Placeholder?", rawKey === "pk_test_placeholder");
    console.groupEnd();

    if (!rawKey || rawKey === "pk_test_placeholder" || rawKey.trim() === "") {
      return null;
    }
    return loadStripe(rawKey);
  }, []);

  useEffect(() => {
    if (shipmentId) {
      dispatch(getShipmentById(shipmentId));
      dispatch(createPaymentIntent(shipmentId));
    }
  }, [dispatch, shipmentId]);

  // Handle Missing Configuration
  if (!stripePromise) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <Card className="p-12 border-red-200 bg-red-50 shadow-sm text-center">
          <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold mb-4 text-red-700">Stripe Key Still Not Detected</h2>
          
          <div className="text-left bg-white p-6 rounded-lg border border-red-100 mb-6 space-y-4">
            <p className="text-gray-700 font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" /> 
              Please verify the following 4 steps:
            </p>
            <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-600">
              <li>
                <strong>File Location:</strong> Is the file named exactly <code className="bg-gray-100 px-1">.env</code> and located in the <code className="bg-gray-100 px-1">frontend/</code> folder (outside <code className="bg-gray-100 px-1">src</code>)?
              </li>
              <li>
                <strong>Variable Name:</strong> Does it start with <code className="bg-gray-100 px-1">VITE_</code>? It must be: <br/>
                <code className="text-blue-600">VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...</code>
              </li>
              <li>
                <strong>No Spaces:</strong> Ensure there are no spaces around the <code className="bg-gray-100 px-1">=</code> sign.
              </li>
              <li>
                <strong>Hard Restart:</strong> Close the terminal, run <code className="bg-gray-100 px-1">npm run dev</code> again.
              </li>
            </ol>
          </div>

          <Button 
            className="w-full md:w-auto" 
            onClick={() => window.location.reload()}
          >
            I've restarted the server, check again
          </Button>
        </Card>
      </div>
    );
  }

  if (loading || !clientSecret || !currentShipment) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p className="text-gray-500 font-medium italic">Connecting to secure gateway...</p>
      </div>
    );
  }

  const amount = currentShipment?.selectedRate?.finalRate || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/user" },
          { label: "Payment" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8 shadow-md border-gray-100">
            <h3 className="text-xl font-bold mb-6 border-b pb-4 text-gray-800">Complete Payment</h3>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm
                amount={amount}
                onSuccess={() => navigate(`/user/paymentSuccess/${shipmentId}`)}
                onError={(err) => setStripeError(err)}
              />
            </Elements>
            {stripeError && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                {stripeError}
              </div>
            )}
          </Card>
        </div>

        <Card className="h-fit shadow-md border-gray-100 sticky top-6">
          <h3 className="font-bold text-lg mb-6 border-b pb-4 text-gray-800">Order Summary</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Carrier</span>
              <span className="font-bold">{currentShipment.selectedRate?.carrier}</span>
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black text-blue-600">${amount.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Payment() {
  return <PaymentContent />;
}
