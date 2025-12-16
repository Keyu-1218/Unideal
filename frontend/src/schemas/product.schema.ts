import * as z from "zod";

export const TitleStepSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must be less than 100 characters")
    .trim(),
});

export const DescriptionStepSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 500 characters")
    .trim(),
});

export const PhotoStepSchema = z.object({
  photos: z
    .array(z.instanceof(File))
    .min(1, "At least one photo is required")
    .max(5, "Maximum 5 photos allowed")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each photo must be less than 5MB"
    )
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
        ),
      "Only JPEG, PNG, WEBP, and AVIF images are allowed"
    ),
});

export const PriceStepSchema = z.object({
  price: z
    .string()
    .min(1, "Price must be greater than 0")
    .max(4, "Price is too high"),
});

export const AddressStepSchema = z.object({
  address: z.object({
    country: z.string().min(1, " Country is required"),
    city: z.string().min(1, "City is required"),
    streetAddress: z.string().min(1, "Street address is required"),
  }),
});

export const DatesStepSchema = z.object({
  availableDates: z
    .object({
      startDate: z.date().nullable(), 
      endDate: z.date().nullable(),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) {
          return false;
        }
        return data.startDate < data.endDate;
      },
      {
        message: "End date must be after start date",
        path: ["endDate"],
      }
    )
    .refine((data) => data.startDate !== null, {
      message: "Start date is required",
      path: ["startDate"],
    })
    .refine((data) => data.endDate !== null, {
      message: "End date is required",
      path: ["endDate"],
    }),
});

export const AddProductSchema = z
  .object({
    ...TitleStepSchema.shape,
    ...DescriptionStepSchema.shape,
    ...PhotoStepSchema.shape,
    ...AddressStepSchema.shape,
    ...PriceStepSchema.shape,
    ...DatesStepSchema.shape, 
  })
  .refine(
    (data) => {
      if (!data.availableDates.startDate || !data.availableDates.endDate) {
        return true;
      }
      return data.availableDates.startDate < data.availableDates.endDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"], 
    }
  );

export type AddProductData = z.infer<typeof AddProductSchema>;
