import { Check, Crown } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Breadcrumb } from '../../components/Breadcrumb';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out ShipFast',
    features: [
      'Up to 10 shipments/month',
      'Basic price comparison',
      'Standard tracking',
      'Email support',
      '5% platform fee',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: 499,
    period: 'month',
    description: 'Best for growing businesses',
    features: [
      'Unlimited shipments',
      'Advanced price comparison',
      'Priority tracking',
      'Priority support',
      '2% platform fee',
      'Bulk shipping discounts',
      'API access',
      'Custom branding',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 999,
    period: 'month',
    description: 'For large-scale operations',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      '24/7 phone support',
      'No platform fees',
      'White-label solution',
      'Custom integrations',
      'SLA guarantee',
      'Volume discounts',
    ],
  },
];

export default function Subscription() {
  return (
    <div className="space-y-6
                    bg-white dark:bg-slate-800
                    text-gray-900 dark:text-white
                    p-6 rounded-xl transition-colors duration-300">

      <Breadcrumb items={[
        { label: 'Dashboard', href: '/user' },
        { label: 'Subscription Plans' }
      ]} />

      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400">
          Upgrade to unlock more features and save on every shipment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`relative flex flex-col h-full dark:bg-slate-800 dark:border-slate-600 ${
              plan.recommended 
                ? 'ring-2 ring-blue-500 shadow-xl' 
                : plan.current 
                ? 'ring-2 ring-teal-500' 
                : ''
            }`}
          >

            {plan.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Recommended
                </div>
              </div>
            )}

            {plan.current && (
              <div className="absolute top-0 right-0 
                              bg-teal-100 text-teal-700
                              dark:bg-teal-900/30 dark:text-teal-400
                              px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Current Plan
              </div>
            )}

           
            <div className="flex-1">

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold dark:text-white">
                    {plan.price} EGP
                  </span>
                  <span className="text-gray-600 dark:text-slate-400">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 
                                    bg-green-100 dark:bg-green-900/30
                                    rounded-full flex items-center 
                                    justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-slate-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

            </div>

            <Button 
              variant={plan.recommended ? 'primary' : 'secondary'}
              className="w-full mt-auto"
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : plan.recommended ? 'Upgrade Now' : 'Choose Plan'}
            </Button>

          </Card>
        ))}
      </div>

      <Card className="max-w-4xl mx-auto 
                       bg-blue-50 border-blue-200
                       dark:bg-slate-700 dark:border-slate-600">
        <div className="text-center py-6">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">
            Need a custom solution?
          </h3>
          <p className="text-gray-700 dark:text-slate-400 mb-4">
            Contact our sales team for enterprise pricing and custom features
          </p>
          <Button variant="secondary">Contact Sales</Button>
        </div>
      </Card>

    </div>
  );
}