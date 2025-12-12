// src/services/products/types.ts
export interface AddProductInput {
  title: string;
  short_description: string;
  price?: number;
  pickup: {
    date: {
      available_from: string;
      available_to: string;
    };
    address: {
      country: string;
      city: string;
      street: string;
      postal_code: string;
    };
  };
}

export interface AddProductResponse {
  message: string;
  id: number;
}

export interface UploadPhotosResponse {
  message: string;
}
