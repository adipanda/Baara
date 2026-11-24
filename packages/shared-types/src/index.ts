export type CurrencyCode =
  | 'XOF'
  | 'XAF'
  | 'NGN'
  | 'KES'
  | 'GHS'
  | 'MAD'
  | 'ZAR'
  | 'USD'
  | 'EUR';

export type CountryCode =
  | 'SN'
  | 'CI'
  | 'ML'
  | 'BF'
  | 'TG'
  | 'BJ'
  | 'CM'
  | 'NG'
  | 'KE'
  | 'GH'
  | 'MA'
  | 'ZA';

export type UserRole =
  | 'CLIENT'
  | 'FREELANCER'
  | 'LOCAL_PROVIDER'
  | 'AGENCY'
  | 'ENTERPRISE'
  | 'ADMIN'
  | 'MODERATOR'
  | 'AUDITOR';

export type PaymentProvider =
  | 'ORANGE_MONEY'
  | 'WAVE'
  | 'MOOV_MONEY'
  | 'MTN_MOMO'
  | 'AIRTEL_MONEY'
  | 'SASPAY'
  | 'STRIPE';

export type ServiceVertical = 'DIGITAL_FREELANCE' | 'LOCAL_SERVICE';

export interface Money {
  amountMinor: string; // serialized bigint in minor units (e.g., centimes/kobo)
  currency: CurrencyCode;
}

export interface EscrowFundRequest {
  contractId: string;
  clientId: string;
  providerId: string;
  amountMinor: string;
  currency: CurrencyCode;
  paymentProvider: PaymentProvider;
  idempotencyKey: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  traceId?: string;
}
