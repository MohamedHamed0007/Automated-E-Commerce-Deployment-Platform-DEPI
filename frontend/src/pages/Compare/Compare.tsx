import { Check, Clock, Shield, Star, TrendingUp, Zap, Loader2, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../../components/Badge';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAppDispatch, useAppSelector } from '../../redux/hookredux';
import { compareRates, selectRate } from '../../redux/thunk/shipmentThunk';
import type { IRate } from '../../types';
import toast from 'react-hot-toast';

type BadgeType = 'fastest' | 'cheapest' | 'recommended';

const filters = [
  { id: 'all', label: 'All Couriers' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'best-rated', label: 'Recommended' }
];

export default function Compare() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { currentShipment, rates, loading, error } = useAppSelector((state) => state.shipment);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [selectingRate, setSelectingRate] = useState(false);

  const safeRates = Array.isArray(rates) ? rates : [];

  useEffect(() => {
    if (shipmentId) {
      dispatch(compareRates(shipmentId));
    }
  }, [dispatch, shipmentId]);

  // -------------------------------------------------------------
  // Filter logic: display the selected result only and match Best Rated with Recommended
  // -------------------------------------------------------------
  const displayedRates = useMemo(() => {
    if (safeRates.length === 0) return [];

    const ratesCopy = [...safeRates];
    const currentCheapest = [...ratesCopy].sort((a, b) => a.finalRate - b.finalRate)[0];
    const currentFastest = [...ratesCopy].sort((a, b) => a.deliveryDays - b.deliveryDays)[0];

    switch (selectedFilter) {
      case 'fastest':
        return [currentFastest]; // Shows fastest option only
      case 'cheapest':
        return [currentCheapest]; // Shows cheapest option only
      case 'best-rated': {
        // Gets the option with "recommended" badge (neither cheapest nor fastest)
        const recommendedRates = ratesCopy.filter(
          (r) =>
            r.shippoRateId !== currentCheapest?.shippoRateId &&
            r.shippoRateId !== currentFastest?.shippoRateId
        );

        if (recommendedRates.length > 0) {
          // If multiple recommended options exist, select the one with the best value
          recommendedRates.sort(
            (a, b) => a.finalRate * a.deliveryDays - b.finalRate * b.deliveryDays
          );
          return [recommendedRates[0]];
        }

        // Fallback if no other options exist besides cheapest and fastest (returns best overall value)
        ratesCopy.sort((a, b) => a.finalRate * a.deliveryDays - b.finalRate * b.deliveryDays);
        return [ratesCopy[0]];
      }
      case 'all':
      default:
        return ratesCopy; // Shows all options
    }
  }, [safeRates, selectedFilter]);

  if (!shipmentId) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-semibold">No shipment ID found</h2>
        <Button onClick={() => navigate('/user/newshipment')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (loading && safeRates.length === 0) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-semibold">Loading rates...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-semibold text-red-600">{error}</h2>
        <Button onClick={() => navigate('/user/newshipment')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const handleBookNow = async (rate: IRate) => {
    if (!shipmentId) return;
    setSelectedRateId(rate.shippoRateId);
    setSelectingRate(true);
    try {
      await dispatch(selectRate({ shipmentId, shippoRateId: rate.shippoRateId })).unwrap();
      navigate(`/user/payment/${shipmentId}`);
    } catch (err: any) {
      toast.error(err || 'Failed to select rate');
    } finally {
      setSelectingRate(false);
    }
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

  const sortedRates = [...safeRates].sort((a, b) => a.finalRate - b.finalRate);
  const cheapestRate = sortedRates[0];
  const fastestRate = [...safeRates].sort((a, b) => a.deliveryDays - b.deliveryDays)[0];

  const getBadges = (rate: IRate): BadgeType[] => {
    const badges: BadgeType[] = [];
    if (rate.shippoRateId === cheapestRate?.shippoRateId) {
      badges.push('cheapest');
    }
    if (rate.shippoRateId === fastestRate?.shippoRateId) {
      badges.push('fastest');
    }
    if (badges.length === 0) {
      badges.push('recommended');
    }
    return badges;
  };

  return (
    <div className="space-y-6 container mx-auto">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/user' },
          { label: 'New Shipment', href: '/user/newshipment' },
          { label: 'Compare Prices' }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Compare Shipping Rates
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Choose the best option for your shipment
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none justify-center bg-white dark:bg-gray-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none justify-center bg-white dark:bg-gray-800"
            onClick={() =>
              navigate('/user/newshipment', { state: { editShipment: currentShipment } })
            }
          >
            Edit Details
          </Button>
        </div>
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
                {currentShipment?.package?.weight
                  ? `${currentShipment.package.weight} ${currentShipment.package.units === 'cm' ? 'kg' : 'lb'}`
                  : 'N/A'}{' '}
                •{' '}
                {currentShipment?.package?.length
                  ? `${currentShipment.package.length}x${currentShipment.package.width}x${currentShipment.package.height} ${currentShipment.package.units}`
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-300">Route</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {currentShipment?.senderAddress?.city || 'N/A'} →{' '}
              {currentShipment?.receiverAddress?.city || 'N/A'}
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
        {displayedRates.map((rate) => (
          <Card
            key={rate.shippoRateId}
            hover
            className={`transition-all duration-200 dark:bg-slate-800 ${
              selectedRateId === rate.shippoRateId ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center gap-6">
              {/* Logo placeholder */}
              <div className="w-24 h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {rate.carrier.substring(0, 3).toUpperCase()}
                </span>
              </div>

              {/* Courier Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {rate.carrier} - {rate.service}
                  </h3>
                  <div className="flex gap-2">
                    {getBadges(rate).map((badge) => (
                      <Badge key={badge} variant={badge} className="flex items-center gap-1">
                        {getBadgeIcon(badge)}
                        <span className="capitalize">{badge}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>{rate.deliveryDays} days</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Real-time tracking</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Insurance included</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="text-right shrink-0">
                <div className="mb-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ${rate.finalRate.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{rate.currency}</p>
                </div>
                <Button
                  className="w-full min-w-35"
                  onClick={() => handleBookNow(rate)}
                  variant={selectedRateId === rate.shippoRateId ? 'success' : 'primary'}
                  loading={selectingRate && selectedRateId === rate.shippoRateId}
                >
                  {selectedRateId === rate.shippoRateId ? (
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
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Price Protection Guarantee
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              All prices shown include our platform fee. If you find a better rate within 24 hours
              of booking, we'll refund the difference.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
