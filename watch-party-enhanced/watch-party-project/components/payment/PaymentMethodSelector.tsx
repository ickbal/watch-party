import { useState } from 'react';
import { SubscriptionPlan, CryptoPaymentProvider } from '../../lib/payment-types';

interface PaymentMethodSelectorProps {
  onSelectMethod: (method: CryptoPaymentProvider) => void;
  selectedMethod?: CryptoPaymentProvider;
}

export default function PaymentMethodSelector({ onSelectMethod, selectedMethod }: PaymentMethodSelectorProps) {
  const paymentMethods: { id: CryptoPaymentProvider; name: string; description: string; coins: string[] }[] = [
    {
      id: 'cryptapi',
      name: 'CryptAPI',
      description: 'Pay with multiple cryptocurrencies with low fees and fast confirmation times',
      coins: ['Bitcoin', 'Ethereum', 'Litecoin', 'USDT', 'USDC', 'and 70+ more']
    },
    {
      id: 'coingate',
      name: 'CoinGate',
      description: 'Secure cryptocurrency payments with extensive coin support and reliable processing',
      coins: ['Bitcoin', 'Ethereum', 'Litecoin', 'XRP', 'and 50+ more']
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Select Payment Method</h2>
      
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            className={`
              bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selectedMethod === method.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-700'}
            `}
            onClick={() => onSelectMethod(method.id)}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${selectedMethod === method.id ? 'border-blue-500' : 'border-gray-500'}`}>
                {selectedMethod === method.id && (
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-medium text-white">{method.name}</h3>
                <p className="text-gray-400 mt-1">{method.description}</p>
                
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Supported coins: </span>
                  <span className="text-sm text-gray-300">{method.coins.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-2">About Cryptocurrency Payments</h3>
        <p className="text-gray-400 text-sm">
          Cryptocurrency payments are secure, fast, and have lower fees than traditional payment methods.
          Your subscription will be activated immediately after your payment is confirmed on the blockchain.
          For assistance with payments, please contact our support team.
        </p>
      </div>
    </div>
  );
}
