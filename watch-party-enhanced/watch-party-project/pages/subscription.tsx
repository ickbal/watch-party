import { useState } from 'react';
import { useSession } from 'next-auth/react';
import SubscriptionSelector, { SUBSCRIPTION_PLANS } from '../../components/payment/SubscriptionSelector';
import PaymentMethodSelector from '../../components/payment/PaymentMethodSelector';
import PaymentProcessor from '../../components/payment/PaymentProcessor';
import { SubscriptionPlan, CryptoPaymentProvider } from '../../lib/payment-types';

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<'select-plan' | 'select-method' | 'process-payment' | 'success'>('select-plan');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<CryptoPaymentProvider | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setStep('select-method');
  };

  const handleSelectMethod = (method: CryptoPaymentProvider) => {
    setSelectedMethod(method);
    setStep('process-payment');
  };

  const handlePaymentComplete = (success: boolean, txid?: string) => {
    if (success && txid) {
      setTransactionId(txid);
      setStep('success');
    }
  };

  const handleCancel = () => {
    if (step === 'process-payment') {
      setStep('select-method');
    } else if (step === 'select-method') {
      setStep('select-plan');
    }
  };

  const handleStartOver = () => {
    setSelectedPlan(null);
    setSelectedMethod(null);
    setTransactionId(null);
    setStep('select-plan');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Watch Party Subscription</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'select-plan' ? 'bg-blue-600' : 'bg-blue-900'} text-white`}>
            1
          </div>
          <div className={`h-1 w-16 ${step === 'select-plan' ? 'bg-gray-700' : 'bg-blue-900'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'select-method' ? 'bg-blue-600' : step === 'process-payment' || step === 'success' ? 'bg-blue-900' : 'bg-gray-700'} text-white`}>
            2
          </div>
          <div className={`h-1 w-16 ${step === 'select-plan' || step === 'select-method' ? 'bg-gray-700' : 'bg-blue-900'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'process-payment' ? 'bg-blue-600' : step === 'success' ? 'bg-blue-900' : 'bg-gray-700'} text-white`}>
            3
          </div>
          <div className={`h-1 w-16 ${step === 'success' ? 'bg-blue-900' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'success' ? 'bg-green-600' : 'bg-gray-700'} text-white`}>
            ✓
          </div>
        </div>
        <div className="flex items-center justify-center mt-2 text-sm text-gray-400">
          <div className={`w-24 text-center ${step === 'select-plan' ? 'text-blue-400' : ''}`}>
            Select Plan
          </div>
          <div className={`w-24 text-center ${step === 'select-method' ? 'text-blue-400' : ''}`}>
            Payment Method
          </div>
          <div className={`w-24 text-center ${step === 'process-payment' ? 'text-blue-400' : ''}`}>
            Make Payment
          </div>
          <div className={`w-24 text-center ${step === 'success' ? 'text-green-400' : ''}`}>
            Complete
          </div>
        </div>
      </div>

      {/* Content based on current step */}
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        {step === 'select-plan' && (
          <SubscriptionSelector 
            onSelectPlan={handleSelectPlan} 
            selectedPlanId={selectedPlan?.id}
          />
        )}

        {step === 'select-method' && selectedPlan && (
          <div>
            <div className="mb-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">Selected Plan: {selectedPlan.name}</h3>
              <p className="text-gray-400">
                ${selectedPlan.price} {selectedPlan.currency} for {selectedPlan.duration} days
              </p>
            </div>
            
            <PaymentMethodSelector 
              onSelectMethod={handleSelectMethod} 
              selectedMethod={selectedMethod || undefined}
            />
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={() => selectedMethod && handleSelectMethod(selectedMethod)}
                disabled={!selectedMethod}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'process-payment' && selectedPlan && selectedMethod && (
          <PaymentProcessor 
            plan={selectedPlan} 
            provider={selectedMethod} 
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
            <p className="text-gray-400 mb-6">
              Thank you for subscribing to Watch Party. Your subscription is now active.
            </p>
            
            {transactionId && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg inline-block">
                <p className="text-gray-400">Transaction ID:</p>
                <p className="text-white font-mono">{transactionId}</p>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go to Home
              </button>
              
              <button
                onClick={() => window.location.href = '/room'}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Create a Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
