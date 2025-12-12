import { sql } from '../../db';
import { z } from "zod";

const Schema = z.object({
    seller: z.number(),
    title: z.string().min(3).max(100),
    short_description: z.string().min(10).max(300),
    price: z.number().min(0),
});

type Input = z.infer<typeof Schema>;

export interface Product extends Omit<Input, 'seller'> {
    id: number;
};

export default class ProductRepository {
    readonly schema = Schema;

    readonly create = async (input: Input, theSql = sql): Promise<Product> => {
        const [product] = await theSql/*sql*/`
            INSERT INTO products (seller, title, short_description, price)
            VALUES (${input.seller}, ${input.title}, ${input.short_description}, ${input.price})
            RETURNING id, title, short_description, price
        `;
        return product as Product;
    }

    readonly readSeller = async (id: number, theSql = sql): Promise<number | null> => {
        const [product] = await theSql/*sql*/`
            SELECT seller FROM products WHERE id = ${id}
        `;
        if (!product) {
            return null;
        }
        return product.seller as number;
    };

    readonly readById = async (id: number, theSql = sql): Promise<Product | null> => {
        const [product] = await theSql/*sql*/`
            SELECT id, title, short_description, price
            FROM products
            WHERE id = ${id}
        `;
        if (!product) {
            return null;
        }
        // TODO use postgres types properly
        product.price = Number(product.price);
        return product as Product;
    };

    readonly readAll = async (): Promise<Product[]> => {
        const products = await sql/*sql*/`
            SELECT id, title, short_description, price
            FROM products
            ORDER BY id DESC
        `;
        return products as unknown as Product[];
    };

    readonly deleteById = async (id: number, theSql = sql): Promise<void> => {
        await theSql/*sql*/`
            DELETE FROM products
            WHERE id = ${id}
        `;
    };
};