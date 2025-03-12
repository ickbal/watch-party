import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AccountPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // In a real implementation, this would fetch the user's subscription
  // For now, we'll simulate a subscription
  const mockSubscription = {
    planId: 'premium',
    planName: 'Premium',
    status: 'active',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
    paymentInfo: {
      provider: 'cryptapi',
      amount: 10,
      currency: 'USD',
      txid: 'tx_' + Math.random().toString(36).substring(2, 15)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{session?.user?.name || 'User'}</h2>
              <p className="text-gray-400">{session?.user?.email || 'user@example.com'}</p>
            </div>

            <nav className="space-y-2">
              <Link href="/account" className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg">
                My Subscription
              </Link>
              <Link href="/room" className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                My Rooms
              </Link>
              <Link href="/support" className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Support
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">My Subscription</h2>

            {/* Subscription Details */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">{mockSubscription.planName} Plan</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mockSubscription.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {mockSubscription.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Date:</span>
                  <span className="text-white">{mockSubscription.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">End Date:</span>
                  <span className="text-white">{mockSubscription.endDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Days Remaining:</span>
                  <span className="text-white">
                    {Math.ceil((mockSubscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white">Cryptocurrency ({mockSubscription.paymentInfo.provider})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Payment:</span>
                  <span className="text-white">${mockSubscription.paymentInfo.amount} {mockSubscription.paymentInfo.currency}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-lg font-medium text-white mb-3">Transaction History</h4>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">Payment for {mockSubscription.planName} Plan</p>
                      <p className="text-sm text-gray-400">{mockSubscription.startDate.toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">${mockSubscription.paymentInfo.amount} {mockSubscription.paymentInfo.currency}</p>
                      <p className="text-xs text-gray-400 font-mono">TX: {mockSubscription.paymentInfo.txid}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link href="/subscription" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Upgrade Plan
              </Link>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Cancel Subscription
              </button>
              <Link href="/support" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Billing Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
