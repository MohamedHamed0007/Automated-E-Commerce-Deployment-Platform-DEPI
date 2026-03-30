import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAppDispatch, useAppSelector } from "../../redux/hookredux";
import { createPaymentIntent } from "../../redux/thunk/paymentThunk";
import { getShipmentById } from "../../redux/thunk/shipmentThunk";
import StripePaymentForm from "../../components/StripePaymentForm/StripePaymentForm";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

function PaymentContent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { clientSecret, loading: paymentLoading, error: paymentError } = useAppSelector((state) => state.payment);
  const { currentShipment } = useAppSelector((state) => state.shipment);
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    if (shipmentId) {
      dispatch(getShipmentById(shipmentId));
      dispatch(createPaymentIntent(shipmentId));
    }
  }, [dispatch, shipmentId]);

  if (!shipmentId) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/user" },
            { label: "Payment" },
          ]}
        />
        <Card className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No shipment selected. Please go back to comparison.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/user/newshipment")}
          >
            Go to New Shipment
          </Button>
        </Card>
      </div>
    );
  }

  if (paymentLoading || !clientSecret) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/user" },
            { label: "New Shipment", href: "/user/newshipment" },
            { label: "Compare", href: `/user/compare/${shipmentId}` },
            { label: "Payment" },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/user" },
            { label: "Payment" },
          ]}
        />
        <Card className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{paymentError}</p>
          <Button
            className="mt-4"
            onClick={() => navigate(`/user/compare/${shipmentId}`)}
          >
            Go to Comparison
          </Button>
        </Card>
      </div>
    );
  }

  const selectedRate = currentShipment?.selectedRate;
  const amount = selectedRate?.finalRate || 0;

  const handlePaymentSuccess = () => {
    toast.success("Payment successful!");
    navigate(`/user/paymentSuccess/${shipmentId}`);
  };

  const handlePaymentError = (error: string) => {
    setStripeError(error);
    toast.error(error);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/user" },
          { label: "New Shipment", href: "/user/newshipment" },
          { label: "Compare", href: `/user/compare/${shipmentId}` },
          { label: "Payment" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Complete Payment
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and confirm your shipment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Payment Details
            </h3>
            <StripePaymentForm
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            {stripeError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-4">{stripeError}</p>
            )}
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Summary
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Courier</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedRate?.carrier} - {selectedRate?.service}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Delivery Time</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedRate?.deliveryDays} days
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">From → To</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {currentShipment?.senderAddress.city} → {currentShipment?.receiverAddress.city}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-right">
                  Including all fees
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentContent />
    </Elements>
  );
}