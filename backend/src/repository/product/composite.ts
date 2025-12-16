import ProductRepository, { Product } from "./product.js";
import ProductPickupDateRepository from "./pickup-date.js";
import ProductPickupAddressRepository from "./pickup-address.js";
import ProductPhotoRepository from "./photo.js";

import { z } from "zod";
import { sql } from "../../db.js";

const productRepository = new ProductRepository();
const productPickupDateRepository = new ProductPickupDateRepository();
const productPickupAddressRepository = new ProductPickupAddressRepository();
const productPhotoRepository = new ProductPhotoRepository();

export const AddProductSchema = productRepository.schema.extend({
    pickup: z.object({
        date: productPickupDateRepository.schema.omit({ product_id: true }),
        address: productPickupAddressRepository.schema.omit({ product_id: true }),
    }),
});

export type AddProductInput = Parameters<ProductRepository['create']>[0] & {
    pickup: {
        date: Omit<Parameters<ProductPickupDateRepository['create']>[0], 'product_id'>;
        address: Omit<Parameters<ProductPickupAddressRepository['create']>[0], 'product_id'>;
    };
};

export interface AddProduct extends AddProductInput, Product {
};

export interface GetProduct extends Product {
    pickup: {
        date: Omit<Parameters<ProductPickupDateRepository['create']>[0], 'product_id'>;
        address: Omit<Parameters<ProductPickupAddressRepository['create']>[0], 'product_id'>;
    };
    photos: string[];
}

export default class CompositeProductRepository {
    readonly schema = AddProductSchema;

    readonly create = async (input: AddProductInput): Promise<number> => {
        return await sql.begin(async sql => {
            const product = await productRepository.create(input, sql);

            await productPickupDateRepository.create({ ...input.pickup.date, product_id: product.id }, sql);

            await productPickupAddressRepository.create({ ...input.pickup.address, product_id: product.id }, sql);

            return product.id;
        });
    };

    readonly readById = async (id: number): Promise<GetProduct | null> => {
        return await sql.begin(async sql => {
            const product = await productRepository.readById(id, sql);
            if (!product) {
                return null;
            }

            const pickupDate = await productPickupDateRepository.getById(id, sql);
            const pickupAddress = await productPickupAddressRepository.getByProductId(id, sql);

            const photosData = await productPhotoRepository.readByProductId(id, sql);
            const photos = photosData.map(photo => photo.photo_url);

            return {
                ...product,
                pickup: {
                    date: {
                        ...pickupDate!,
                        product_id: undefined,
                    },
                    address: {
                        ...pickupAddress!,
                        product_id: undefined,
                    },
                },
                photos,
            } as GetProduct;
        });
    }
}