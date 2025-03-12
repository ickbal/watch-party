import { useState } from 'react';
import { useSession } from 'next-auth/react';

type FeedbackType = 'bug' | 'feature' | 'general' | 'payment';

interface SupportFormProps {
  onClose?: () => void;
}

export default function SupportForm({ onClose }: SupportFormProps) {
  const { data: session } = useSession();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [type, setType] = useState<FeedbackType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !message || !email) {
      setSubmitStatus('error');
      setErrorMessage('Please fill out all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/support/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          message,
          email,
          type,
          username: session?.user?.name || 'Anonymous User',
          userId: session?.user?.id || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setSubmitStatus('success');
      setSubject('');
      setMessage('');
      setType('general');
      
      // Auto-close after success if onClose is provided
      if (onClose) {
        setTimeout(onClose, 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto my-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Contact Support</h2>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-800 text-white p-4 rounded mb-6">
          Thank you for your feedback! Our team will review it shortly.
        </div>
      ) : null}
      
      {submitStatus === 'error' ? (
        <div className="bg-red-800 text-white p-4 rounded mb-6">
          {errorMessage}
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white mb-2">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="type" className="block text-white mb-2">
            Feedback Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as FeedbackType)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            disabled={isSubmitting}
          >
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="payment">Payment Issue</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="subject" className="block text-white mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-white mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            rows={5}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}
