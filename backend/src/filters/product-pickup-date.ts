import { Product } from "../repository/product/product.js";

import { sql } from "../db.js";

export const filter = async (products: Product[], available_from?: string, available_to?: string): Promise<Product[]> => {
    if (!available_from && !available_to) {
        return products;
    }

    const product_ids = products.map(p => p.id);
    let query: any[] = await sql/*sql*/`
        SELECT product_id FROM product_pickup_date
        WHERE product_id IN ${sql(product_ids)}
        AND available_from <= ${available_from || '9999-12-30'} 
        AND available_to >= ${available_to || '0001-01-01'}
    `;
    query = query.map(row => row.product_id);
    products = products.filter(p => query.includes(p.id));

    return products;
}