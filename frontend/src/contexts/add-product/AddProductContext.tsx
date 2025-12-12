import { createContext } from "react";

interface Dates {
  startDate: Date | null;
  endDate: Date | null;
}

interface Address {
  country: string;
  city: string;
  streetAddress: string;
  postalCode: string;
}

export interface AddProductData {
  title: string;
  description: string;
  photos: File[];
  address: Address;
  price: string;
  availableDates: Dates;
}

export type ErrorKey =
  | "title"
  | "description"
  | "price"
  | "photos"
  | "address.country"
  | "address.city"
  | "address.streetAddress"
  | "address.postalCode"
  | "availableDates.startDate"
  | "availableDates.endDate";

export interface AddProductContextType {
  data: AddProductData;
  errors: Record<ErrorKey, string>;
  updateData: (key: keyof AddProductData, value: any) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
  resetData: () => void;
}

export const initialData: AddProductData = {
  title: "",
  description: "",
  photos: [],
  address: {
    country: "",
    city: "",
    streetAddress: "",
    postalCode: "",
  },
  price: "",
  availableDates: {
    startDate: null,
    endDate: null,
  },
};

export const AddProductContext = createContext<
  AddProductContextType | undefined
>(undefined);
