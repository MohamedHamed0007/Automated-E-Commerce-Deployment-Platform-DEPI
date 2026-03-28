import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, Package, Download, ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";
 
export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackingNumber: trackingNumberParam } = useParams<{
    trackingNumber: string;
  }>();
 
  // الـ state جاي من Payment page
  const courier = location.state?.courier;
  const shipment = location.state?.shipment;
  const trackingNumber =
    location.state?.trackingNumber ??
    trackingNumberParam ??
    localStorage.getItem("lastTrackingNumber");
 
  const handleTrackShipment = () => {
    if (!trackingNumber) {
      toast.error("Tracking number not found!");
      return;
    }
    navigate(`/user/tracking/${trackingNumber}`, {
      state: { courier, trackingNumber, shipment },
    });
  };
 
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card className="text-center py-12 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
 
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your shipment has been confirmed and will be picked up soon.
          </p>
 
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8 border border-transparent dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Tracking Number
                </p>
                <p className="font-semibold text-gray-900 dark:text-white font-mono text-sm">
                  {trackingNumber ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Courier
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {courier?.name ?? shipment?.courier?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Amount Paid
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  $
                  {courier?.price != null
                    ? courier.price.toFixed(2)
                    : shipment?.courier?.price != null
                    ? shipment.courier.price.toFixed(2)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Estimated Delivery
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {courier?.deliveryTime ??
                    shipment?.courier?.deliveryTime ??
                    "—"}
                </p>
              </div>
              {shipment?.from && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    From
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {shipment.from}
                  </p>
                </div>
              )}
              {shipment?.to && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    To
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {shipment.to}
                  </p>
                </div>
              )}
            </div>
          </div>
 
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={handleTrackShipment}>
              <Package className="w-4 h-4 mr-2" />
              Track Shipment
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/user")}
              className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              variant="ghost"
              className="dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={() => toast("Receipt download coming soon!")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </Card>
 
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-blue-100 mb-2">
              What's Next?
            </h3>
            <p className="text-sm text-gray-700 dark:text-blue-200/80">
              You'll receive an email confirmation shortly. The courier will
              contact you to schedule a pickup within 24 hours.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}