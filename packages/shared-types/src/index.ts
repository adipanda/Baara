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

export type KycTier = 'TIER_0' | 'TIER_1' | 'TIER_2';

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

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  countryCode: CountryCode;
  kycTier: KycTier;
  iat: number;
  exp: number;
}

export interface RegisterRequest {
  email: string;
  phoneE164: string;
  password: string;
  countryCode: CountryCode;
  preferredCurrency?: CurrencyCode;
  role: Extract<UserRole, 'CLIENT' | 'FREELANCER' | 'LOCAL_PROVIDER' | 'AGENCY' | 'ENTERPRISE'>;
}

export interface LoginRequest {
  email: string;
  password: string;
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

export interface EscrowReleaseRequest {
  contractId: string;
  commissionBps?: number;
  taxBps?: number;
  idempotencyKey: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CreateLocalBookingRequest {
  providerId: string;
  categorySlug: string;
  location: GeoPoint;
  scheduledStartIso: string;
  scheduledEndIso: string;
  amountMinor: string;
  currency: CurrencyCode;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  categorySlug: string;
  vertical: ServiceVertical;
  budgetMinMinor: string;
  budgetMaxMinor: string;
  currency: CurrencyCode;
  countryCode: CountryCode;
}

export interface CreateProposalRequest {
  amountMinor: string;
  currency: CurrencyCode;
  coverLetter: string;
  deliveryDays: number;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  traceId?: string;
}
