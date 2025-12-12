import { sql } from '../../db';
import { z } from 'zod';

const Schema = z.object({
    product_id: z.number(),
    country: z.string().max(100),
    city: z.string().max(100),
    street: z.string().max(255),
    postal_code: z.string().max(20),
});

type Input = z.infer<typeof Schema>;

export interface ProductPickupAddress extends Input {
};

export default class ProductPickupAddressRepository {
    readonly schema = Schema;

    readonly create = async (input: Input, theSql = sql): Promise<ProductPickupAddress> => {
        const [productPickupAddress]: [ProductPickupAddress] = await theSql/*sql*/`
            INSERT INTO product_pickup_address (product_id, country, city, street, postal_code)
            VALUES (${input.product_id}, ${input.country}, ${input.city}, ${input.street}, ${input.postal_code})
            RETURNING *`;
        return productPickupAddress;
    };

    readonly getByProductId = async (productId: number, theSql = sql): Promise<ProductPickupAddress | null> => {
        const [productPickupAddress]: [ProductPickupAddress] = await theSql/*sql*/`
            SELECT * FROM product_pickup_address WHERE product_id = ${productId}`;
        if (!productPickupAddress) {
            return null;
        }
        return productPickupAddress;
    };
};