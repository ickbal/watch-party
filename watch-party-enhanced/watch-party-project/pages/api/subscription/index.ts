import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { UserSubscription } from '../../../lib/payment-types';

// Mock database for storing subscription information
// In a real implementation, this would be a database
const subscriptionStore: Record<string, UserSubscription> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session || !session.user) {
    return res.status(401).json({ status: 'error', error: 'Unauthorized' });
  }
  
  // GET request to fetch user's subscription
  if (req.method === 'GET') {
    const userId = session.user.id as string;
    
    // Check if user has an active subscription
    const subscription = Object.values(subscriptionStore).find(
      sub => sub.userId === userId && sub.status === 'active'
    );
    
    if (!subscription) {
      return res.status(404).json({ 
        status: 'error', 
        error: 'No active subscription found' 
      });
    }
    
    return res.status(200).json({
      status: 'success',
      subscription
    });
  }
  
  // POST request to create/update subscription after payment
  if (req.method === 'POST') {
    try {
      const { planId, paymentId, txid } = req.body;
      
      // Validate required fields
      if (!planId || !paymentId || !txid) {
        return res.status(400).json({ 
          status: 'error', 
          error: 'Missing required fields' 
        });
      }
      
      const userId = session.user.id as string;
      
      // Create a new subscription
      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Get payment info from payment store (in a real implementation)
      // For now, we'll create mock payment info
      const paymentInfo = {
        provider: Math.random() > 0.5 ? 'cryptapi' : 'coingate',
        address: `crypto_address_${Math.random().toString(36).substring(2, 15)}`,
        amount: Math.floor(Math.random() * 100) + 5,
        currency: 'USD',
        status: 'confirmed',
        txid,
        confirmations: Math.floor(Math.random() * 6) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      
      // Set duration based on plan (in a real implementation, this would come from the plan)
      // For now, we'll use a mock duration
      const duration = 30; // 30 days
      endDate.setDate(endDate.getDate() + duration);
      
      // Create subscription
      const subscription: UserSubscription = {
        userId,
        planId,
        status: 'active',
        startDate,
        endDate,
        paymentInfo,
        autoRenew: false
      };
      
      // Store subscription
      subscriptionStore[subscriptionId] = subscription;
      
      return res.status(200).json({
        status: 'success',
        subscriptionId,
        subscription
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ 
        status: 'error', 
        error: 'Failed to create subscription' 
      });
    }
  }
  
  // DELETE request to cancel subscription
  if (req.method === 'DELETE') {
    try {
      const { subscriptionId } = req.body;
      
      // Validate required fields
      if (!subscriptionId) {
        return res.status(400).json({ 
          status: 'error', 
          error: 'Missing subscription ID' 
        });
      }
      
      const userId = session.user.id as string;
      
      // Check if subscription exists and belongs to user
      const subscription = subscriptionStore[subscriptionId];
      
      if (!subscription) {
        return res.status(404).json({ 
          status: 'error', 
          error: 'Subscription not found' 
        });
      }
      
      if (subscription.userId !== userId) {
        return res.status(403).json({ 
          status: 'error', 
          error: 'Not authorized to cancel this subscription' 
        });
      }
      
      // Update subscription status
      subscription.status = 'cancelled';
      subscription.autoRenew = false;
      
      return res.status(200).json({
        status: 'success',
        message: 'Subscription cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return res.status(500).json({ 
        status: 'error', 
        error: 'Failed to cancel subscription' 
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ status: 'error', error: 'Method not allowed' });
}
