import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Package, Download, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useAppDispatch, useAppSelector } from "../../redux/hookredux";
import { getShipmentById } from "../../redux/thunk/shipmentThunk";
  
export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { currentShipment, loading } = useAppSelector((state) => state.shipment);
 
  useEffect(() => {
    if (shipmentId) {
      dispatch(getShipmentById(shipmentId));
    }
  }, [dispatch, shipmentId]);

  const handleTrackShipment = () => {
    if (!shipmentId) {
      return;
    }
    navigate(`/user/tracking/${shipmentId}`);
  };
 
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const trackingNumber = currentShipment?.trackingNumber;
  const selectedRate = currentShipment?.selectedRate;
  const amount = selectedRate?.finalRate || 0;

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
                  {selectedRate?.carrier ?? "—"} - {selectedRate?.service ?? ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Amount Paid
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Estimated Delivery
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedRate?.deliveryDays ? `${selectedRate.deliveryDays} days` : "—"}
                </p>
              </div>
              {currentShipment?.senderAddress.city && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    From
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {currentShipment.senderAddress.city}
                  </p>
                </div>
              )}
              {currentShipment?.receiverAddress.city && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    To
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {currentShipment.receiverAddress.city}
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
            {currentShipment?.labelUrl && (
              <Button
                variant="ghost"
                className="dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => window.open(currentShipment.labelUrl, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Label
              </Button>
            )}
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