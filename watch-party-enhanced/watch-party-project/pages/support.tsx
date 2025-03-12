import { useState } from 'react';
import Link from 'next/link';
import SupportModal from '../components/support/SupportModal';

export default function SupportPage() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Support Center</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Support</h2>
          <p className="text-gray-300 mb-6">
            Having issues with the Watch Party application? Our support team is here to help.
            Submit a support ticket and we'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Open Support Ticket
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white">How do I create a watch party?</h3>
              <p className="text-gray-300">
                Click the "Generate room" button on the homepage to create a new watch party room.
                You can then share the room link with friends.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">What video sources are supported?</h3>
              <p className="text-gray-300">
                We support YouTube, Vimeo, Twitch, and other major video platforms.
                Simply paste the URL into the video input field.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">How do I sync with other viewers?</h3>
              <p className="text-gray-300">
                Video playback is automatically synchronized for all users in the room.
                You can also use the "Manual sync" button if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Subscription & Payment Support</h2>
        <p className="text-gray-300 mb-6">
          For questions about your subscription, payment methods, or billing issues,
          please open a support ticket or email us directly at support@ickbal-watch-party.com.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Contact Billing Support
          </button>
          <Link
            href="/subscription"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Manage Subscription
          </Link>
        </div>
      </div>
      
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    </div>
  );
}
