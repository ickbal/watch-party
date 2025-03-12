import { useState } from 'react';
import { SubscriptionPlan } from '../../lib/payment-types';

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential features for casual watch parties',
    price: 5,
    currency: 'USD',
    duration: 30, // 30 days
    features: [
      'HD video quality',
      'Up to 5 participants',
      'Basic chat features',
      'Standard support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Enhanced features for regular users',
    price: 10,
    currency: 'USD',
    duration: 30, // 30 days
    features: [
      '4K video quality',
      'Up to 15 participants',
      'Advanced chat with GIFs',
      'Priority support',
      'Custom room customization'
    ]
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    description: 'All features for power users and events',
    price: 20,
    currency: 'USD',
    duration: 30, // 30 days
    features: [
      '4K video quality',
      'Unlimited participants',
      'Advanced chat with GIFs and reactions',
      'Priority support',
      'Custom room customization',
      'Scheduled events',
      'Recording capabilities',
      'Analytics dashboard'
    ]
  },
  {
    id: 'annual',
    name: 'Annual Ultimate',
    description: 'Save 20% with our annual plan',
    price: 192, // 20 * 12 * 0.8 (20% discount)
    currency: 'USD',
    duration: 365, // 365 days
    features: [
      'All Ultimate features',
      '20% discount',
      'Early access to new features',
      'Dedicated support line'
    ]
  }
];

interface SubscriptionSelectorProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  selectedPlanId?: string;
}

export default function SubscriptionSelector({ onSelectPlan, selectedPlanId }: SubscriptionSelectorProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Choose Your Subscription Plan</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`
              bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300
              ${selectedPlanId === plan.id ? 'ring-4 ring-blue-500 transform scale-105' : ''}
              ${hoveredPlan === plan.id ? 'transform scale-105' : ''}
              ${plan.id === 'premium' ? 'md:transform md:scale-105' : ''}
            `}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div className={`p-1 text-center text-white ${plan.id === 'premium' ? 'bg-blue-600' : plan.id === 'ultimate' || plan.id === 'annual' ? 'bg-purple-600' : 'bg-gray-700'}`}>
              {plan.id === 'premium' && 'MOST POPULAR'}
              {plan.id === 'annual' && 'BEST VALUE'}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-300 mb-4">{plan.description}</p>
              
              <div className="mb-6 text-center">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-2">
                  {plan.id === 'annual' ? '/year' : '/month'}
                </span>
              </div>
              
              <ul className="mb-8 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onSelectPlan(plan)}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium transition-colors
                  ${plan.id === 'premium' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                    plan.id === 'ultimate' || plan.id === 'annual' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 
                    'bg-gray-700 hover:bg-gray-600 text-white'}
                `}
              >
                {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
