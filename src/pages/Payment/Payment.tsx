import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CreditCard, Wallet, Plus, Lock, Check } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Breadcrumb } from "@/components/Breadcrumb";
 
const paymentMethods = [
  { id: "wallet", name: "Wallet Balance", balance: 850.0, icon: Wallet },
  { id: "card1", name: "Visa •••• 4242", icon: CreditCard },
  { id: "card2", name: "Mastercard •••• 8888", icon: CreditCard },
];
 
export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { shipmentId } = useParams<{ shipmentId: string }>();
 
  // الـ courier والـ shipment جايين من Compare page عبر navigate state
  const courier = location.state?.courier;
  const shipment = location.state?.shipment;
 
  const [selectedMethod, setSelectedMethod] = useState("wallet");
  const [processing, setProcessing] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
 
  const handlePayment = () => {
    if (!courier || !shipment) {
      alert("Missing shipment or courier data. Please go back and try again.");
      navigate("/user/newshipment");
      return;
    }
 
    setProcessing(true);
 
    const trackingNumber = `SH-${new Date().getFullYear()}-${shipmentId}-${Math.floor(
      Math.random() * 9000 + 1000
    )}`;
 
    const shipmentData = {
      id: trackingNumber,
      trackingNumber,
      courier: {
        name: courier.name,
        price: courier.price,
        originalPrice: courier.originalPrice,
        deliveryTime: courier.deliveryTime,
      },
      from: shipment.from,
      to: shipment.to,
      weight: shipment.details?.weight ?? shipment.weight,
      dimensions: shipment.details
        ? `${shipment.details.length}x${shipment.details.width}x${shipment.details.height}`
        : shipment.dimensions ?? "N/A",
      status: "Processing",
      progress: 10,
      currentLocation: shipment.from,
      estimatedDelivery: courier.deliveryTime,
      events: [
        {
          status: "Payment Confirmed",
          location: shipment.from,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          completed: true,
          current: true,
        },
      ],
      details: shipment.details ?? {},
    };
 
    // حفظ في localStorage
    localStorage.setItem(trackingNumber, JSON.stringify(shipmentData));
    // حفظ آخر tracking number للرجوع إليه لو احتجنا
    localStorage.setItem("lastTrackingNumber", trackingNumber);
 
    setTimeout(() => {
      navigate(`/user/paymentSuccess/${trackingNumber}`, {
        state: {
          shipment: shipmentData,
          courier: shipmentData.courier,
          trackingNumber,
        },
      });
    }, 2000);
  };
 
  if (!courier || !shipment) {
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
            No courier or shipment selected. Please go back to comparison.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate(`/user/compare/${shipmentId ?? ""}`)}
          >
            Go to Comparison
          </Button>
        </Card>
      </div>
    );
  }
 
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/user" },
          { label: "New Shipment", href: "/user/newshipment" },
          {
            label: "Compare",
            href: `/user/compare/${shipmentId}`,
          },
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
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Select Payment Method
            </h3>
 
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedMethod === method.id
                        ? "bg-blue-100 dark:bg-blue-900/40"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <method.icon
                      className={`w-6 h-6 ${
                        selectedMethod === method.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {method.name}
                    </p>
                    {method.id === "wallet" && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available: ${method.balance?.toFixed(2)}
                      </p>
                    )}
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
 
              {/* Add New Card */}
              <button
                onClick={() => setShowAddCard(!showAddCard)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Add New Card
                </p>
              </button>
            </div>
 
            {/* Add Card Form */}
            {showAddCard && (
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Add New Card
                </h4>
                <Input
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  icon={<CreditCard className="w-5 h-5" />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Expiry Date" placeholder="MM/YY" />
                  <Input label="CVV" placeholder="123" type="password" />
                </div>
                <Input label="Cardholder Name" placeholder="John Doe" />
                <div className="flex gap-3">
                  <Button className="flex-1">Add Card</Button>
                  <Button variant="ghost" onClick={() => setShowAddCard(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
 
          {/* Security Info */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Secure Payment
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Your payment information is encrypted and secure. We never
                  store your full card details.
                </p>
              </div>
            </div>
          </Card>
        </div>
 
        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Summary
            </h3>
 
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Courier
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {courier.name}
                </p>
              </div>
 
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Delivery Time
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {courier.deliveryTime}
                </p>
              </div>
 
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  From → To
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {shipment.from} → {shipment.to}
                </p>
              </div>
 
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping cost
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    ${courier.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Platform discount
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    -${(courier.originalPrice - courier.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Insurance
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    Included
                  </span>
                </div>
              </div>
 
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${courier.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-right">
                  Including all fees
                </p>
              </div>
 
              <Button
                className="w-full"
                onClick={handlePayment}
                loading={processing}
              >
                Confirm & Pay ${courier.price.toFixed(2)}
              </Button>
 
              <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                By confirming, you agree to our Terms & Conditions
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}