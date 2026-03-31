// types/address.ts
export interface Address {
  zipCode: string;
  street: string;
  quarter: string;
  city: string;
  region: string;
  country: string;
  countryIso: string;
  countryIcon: string;
  isDefault: boolean;
}