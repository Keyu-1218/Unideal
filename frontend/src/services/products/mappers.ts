import type { AddProductData } from "@/schemas/product.schema";
import type { AddProductInput } from "./types";

const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const mapProductDataToApiInput = (
  data: AddProductData
): AddProductInput => {
  return {
    title: data.title.trim(),
    short_description: data.description.trim(),
    price: data.price ? parseFloat(data.price) : undefined,
    pickup: {
      date: {
        available_from: formatDate(data.availableDates.startDate),
        available_to: formatDate(data.availableDates.endDate),
      },
      address: {
        country: data.address.country,
        city: data.address.city,
        street: data.address.streetAddress,
        postal_code: data.address.postalCode,
      },
    },
  };
};
