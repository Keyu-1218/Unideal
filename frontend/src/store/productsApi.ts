import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import type { AddProductInput } from "@/services/products/types";

export interface Product {
  id: number;
  title: string;
  short_description: string;
  price: number;
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
  photos: string[];
}

interface ProductsResponse {
  message: string;
  products: Product[];
}

interface GetProductsParams {
  owned?: boolean;
  available_from?: string;
  available_to?: string;
  location?: string;
  haveCar?: boolean;
  travelDistance?: number;
  includeAllProducts?: string;
}

interface CreateProductResponse {
  message: string;
  id: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_DEV_URL || "http://localhost:5000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => {
        if (!params || Object.keys(params).length === 0) {
          return "/products";
        }

      ;

        const searchParams = new URLSearchParams(
          params as Record<string, string>
        );
        console.log("SEARCH PARAMS API:", searchParams);

        return `/products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation<
      CreateProductResponse,
      { productData: AddProductInput; photos: File[] }
    >({
      queryFn: async (
        { productData, photos },
        api,
        extraOptions,
        baseQuery
      ) => {
        try {
          // STEP 1: POST /products
          const productResult = await baseQuery({
            url: "/products",
            method: "POST",
            body: productData,
          });

          if (productResult.error) {
            return { error: productResult.error };
          }

          const productResponse = productResult.data as CreateProductResponse;

          if (photos.length > 0) {
            const formData = new FormData();
            formData.append("product_id", productResponse.id.toString());
            photos.forEach((file) => {
              formData.append("files", file, file.name);
            });

            const photoResult = await baseQuery({
              url: "products/photos/",
              method: "POST",
              body: formData,
            });

            if (photoResult.error) {
              return { error: photoResult.error };
            }
          }

          return { data: productResponse };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery, useCreateProductMutation } = productsApi;
