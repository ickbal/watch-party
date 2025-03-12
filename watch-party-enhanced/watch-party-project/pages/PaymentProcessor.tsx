import { useState, useEffect } from 'react';
import { CryptoPaymentProvider, SubscriptionPlan } from '../../lib/payment-types';

interface PaymentProcessorProps {
  plan: SubscriptionPlan;
  provider: CryptoPaymentProvider;
  onPaymentComplete: (success: boolean, txid?: string) => void;
  onCancel: () => void;
}

export default function PaymentProcessor({ 
  plan, 
  provider, 
  onPaymentComplete, 
  onCancel 
}: PaymentProcessorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [paymentCurrency, setPaymentCurrency] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 minutes in seconds
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    const createPayment = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create payment request
        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: plan.id,
            provider,
            amount: plan.price,
            currency: plan.currency,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create payment request');
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.error || 'Unknown error occurred');
        }
        
        setPaymentAddress(data.address);
        setPaymentAmount(data.amount);
        setPaymentCurrency(data.currency);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    createPayment();
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [plan, provider]);
  
  // Format time remaining as MM:SS
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Check payment status
  const checkPaymentStatus = async () => {
    if (checkingStatus || !paymentAddress) return;
    
    try {
      setCheckingStatus(true);
      
      const response = await fetch('/api/payment/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          address: paymentAddress,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }
      
      const data = await response.json();
      
      if (data.status === 'confirmed') {
        onPaymentComplete(true, data.txid);
      } else if (data.status === 'failed') {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };
  
  // Copy address to clipboard
  const copyToClipboard = () => {
    if (paymentAddress) {
      navigator.clipboard.writeText(paymentAddress);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Creating payment request...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
        <div className="bg-red-900/50 p-4 rounded-lg mb-6">
          <h3 className="text-red-400 font-bold text-lg mb-2">Error</h3>
          <p className="text-white">{error}</p>
        </div>
        <button
          onClick={onCancel}
          className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (timeRemaining === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
        <div className="bg-yellow-900/50 p-4 rounded-lg mb-6">
          <h3 className="text-yellow-400 font-bold text-lg mb-2">Payment Time Expired</h3>
          <p className="text-white">The payment window has expired. Please try again.</p>
        </div>
        <button
          onClick={onCancel}
          className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Complete Your Payment</h2>
      
      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Amount:</span>
          <span className="text-white font-bold">{paymentAmount} {paymentCurrency}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Plan:</span>
          <span className="text-white">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Provider:</span>
          <span className="text-white">{provider === 'cryptapi' ? 'CryptAPI' : 'CoinGate'}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-400 mb-2">Send payment to this address:</label>
        <div className="flex">
          <input
            type="text"
            value={paymentAddress || ''}
            readOnly
            className="flex-1 bg-gray-900 text-white p-3 rounded-l-lg border border-gray-700 focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="bg-blue-900/30 p-4 rounded-lg">
          <p className="text-white mb-2">Time remaining to complete payment:</p>
          <p className="text-2xl font-mono text-blue-400">{formatTimeRemaining()}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={checkPaymentStatus}
          disabled={checkingStatus}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {checkingStatus ? 'Checking...' : 'I\'ve Made the Payment'}
        </button>
        
        <button
          onClick={onCancel}
          className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-400">
        <p>
          Note: After sending the payment, it may take a few minutes for the transaction to be confirmed on the blockchain.
          You can check the status by clicking the "I've Made the Payment" button.
        </p>
      </div>
    </div>
  );
}