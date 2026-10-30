export interface Address {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface SaveAddressRequest {
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}
