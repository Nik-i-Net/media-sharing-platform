import type { PaymentProfile } from './payment-profile';

export interface PaymentProfilesRepository {
  save(profile: PaymentProfile): Promise<void>;
  findById(id: string): Promise<PaymentProfile | null>;
  findByUserId(userId: string): Promise<PaymentProfile | null>;
  findByProviderCustomerId(customerId: string): Promise<PaymentProfile | null>;
}
