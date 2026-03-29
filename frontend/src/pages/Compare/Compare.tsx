import { Check, Clock, Shield, Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '../../components/Badge';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

type BadgeType = 'fastest' | 'cheapest' | 'recommended';

const couriers = [
  {
    id: 1,
    name: 'DHL Express',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/200px-DHL_Logo.svg.png',
    price: 45.99,
    originalPrice: 52.99,
    deliveryTime: '2-3 days',
    rating: 4.8,
    reviews: 1250,
    features: ['Insurance included', 'Real-time tracking', 'Signature required'],
    badges: ['fastest'] as BadgeType[],
  },
  {
    id: 2,
    name: 'FedEx Standard',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/200px-FedEx_Express.svg.png',
    price: 38.5,
    originalPrice: 42.0,
    deliveryTime: '3-5 days',
    rating: 4.6,
    reviews: 980,
    features: ['Basic tracking', 'Drop-off service', 'Package protection'],
    badges: ['recommended'] as BadgeType[],
  },
  {
    id: 3,
    name: 'J&T Express Economy',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/J%26T_Express_logo.svg/200px-J%26T_Express_logo.svg.png',
    price: 32.99,
    originalPrice: 35.99,
    deliveryTime: '5-7 days',
    rating: 4.3,
    reviews: 756,
    features: ['Budget-friendly', 'Basic tracking', 'Standard delivery'],
    badges: ['cheapest'] as BadgeType[],
  },
  {
    id: 4,
    name: 'UPS Ground',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/UPS_Logo_Shield_2017.svg/200px-UPS_Logo_Shield_2017.svg.png',
    price: 41.75,
    originalPrice: 45.5,
    deliveryTime: '3-4 days',
    rating: 4.7,
    reviews: 1120,
    features: ['Insurance up to $100', 'Tracking included', 'Reliable service'],
    badges: [] as BadgeType[],
  },
];

const filters = [
  { id: 'all', label: 'All Couriers' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'best-rated', label: 'Best Rated' },
];

export default function Compare() {
  const navigate = useNavigate();
  const location = useLocation();
  const shipment = location.state?.shipment; // << لازم تبعت shipment من NewShipment أو الصفحة السابقة
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCourier, setSelectedCourier] = useState<number | null>(null);

  if (!shipment) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-semibold">No shipment data found</h2>
        <Button onClick={() => navigate('/user/newshipment')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const handleBookNow = (courier: typeof couriers[0]) => {
    setSelectedCourier(courier.id);
    // تبعت shipmentId و courier للـ Payment page
    navigate(`/user/payment/${shipment.id}`, { state: { courier, shipment } });
  };

  const getBadgeIcon = (badge: BadgeType) => {
    switch (badge) {
      case 'fastest':
        return <Zap className="w-3 h-3" />;
      case 'cheapest':
        return <TrendingUp className="w-3 h-3" />;
      case 'recommended':
        return <Star className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6 container mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/user' },
          { label: 'New Shipment', href: '/user/newshipment' },
          { label: 'Compare Prices' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Compare Shipping Rates
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Choose the best option for your shipment
          </p>
        </div>
        <Button
          variant="ghost"
          className="bg-white"
          onClick={() => navigate('/user/newshipment')}
        >
          Edit Details
        </Button>
      </div>

      {/* Shipment Summary */}
      <Card className="bg-linear-to-r from-blue-50 to-teal-50 border-blue-200 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Shipment Details</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {shipment.weight} kg • {shipment.dimensions}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-300">Route</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {shipment.from} → {shipment.to}
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === filter.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-blue-500'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Comparison Cards */}
      <div className="space-y-4">
        {couriers.map((courier) => (
          <Card
            key={courier.id}
            hover
            className={`transition-all duration-200 dark:bg-slate-800 ${
              selectedCourier === courier.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="w-24 h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0">
                <img
                  src={courier.logo}
                  alt={courier.name}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>

              {/* Courier Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {courier.name}
                  </h3>
                  <div className="flex gap-2">
                    {courier.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant={badge as BadgeType}
                        className="flex items-center gap-1"
                      >
                        {getBadgeIcon(badge)}
                        <span className="capitalize">{badge}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{courier.rating}</span>
                    <span>({courier.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>{courier.deliveryTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {courier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="text-right shrink-0">
                <div className="mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-through">${courier.originalPrice}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${courier.price}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Save ${(courier.originalPrice - courier.price).toFixed(2)}
                  </p>
                </div>
                <Button
                  className="w-full min-w-35"
                  onClick={() => handleBookNow(courier)}
                  variant={selectedCourier === courier.id ? 'success' : 'primary'}
                >
                  {selectedCourier === courier.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Selected
                    </>
                  ) : (
                    'Book Now'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Price Protection Guarantee</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              All prices shown include our platform fee. If you find a better rate within 24 hours of booking, we'll refund the difference.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}