export type CryptoPaymentProvider = 'cryptapi' | 'coingate';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
}

export interface PaymentInfo {
  provider: CryptoPaymentProvider;
  address: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  txid?: string;
  confirmations?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentStatus = 
  | 'pending' 
  | 'confirming' 
  | 'confirmed' 
  | 'failed' 
  | 'expired';

export interface UserSubscription {
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentInfo: PaymentInfo;
  autoRenew: boolean;
}

export type SubscriptionStatus = 
  | 'active' 
  | 'expired' 
  | 'cancelled' 
  | 'pending';

export interface CryptAPIResponse {
  status: 'success' | 'error';
  address_in: string;
  address_out?: string;
  callback_url?: string;
  price_amount?: number;
  price_currency?: string;
  pay_amount?: number;
  pay_currency?: string;
  txid_in?: string;
  confirmations?: number;
  timestamp?: number;
  error?: string;
}

export interface CoinGateResponse {
  id: string;
  status: string;
  price_amount: string;
  price_currency: string;
  receive_amount: string;
  receive_currency: string;
  payment_url: string;
  token: string;
  created_at: string;
  order_id: string;
  payment_address?: string;
  underpaid_amount?: string;
  overpaid_amount?: string;
  is_refundable?: boolean;
}