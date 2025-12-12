import { sql } from '../../db';
import { z } from 'zod';

const transformDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};
// TODO use postgres date types properly
const transform = (dbProductPickup: DbData): Data => {
    return {
        ...dbProductPickup,
        available_from: transformDate(dbProductPickup.available_from),
        available_to: transformDate(dbProductPickup.available_to),
    };
};

const Schema = z.object({
    product_id: z.number(),
    available_from: z.iso.date(),
    available_to: z.iso.date(),
});

type Input = z.infer<typeof Schema>;

interface Data extends Input {
};


interface DbData {
    product_id: number;
    available_from: Date;
    available_to: Date;
}

export default class ProductPickupDateRepository {
    readonly schema = Schema;

    readonly create = async (input: Input, theSql = sql): Promise<Data> => {
        const [productPickup]: [DbData] = await theSql/*sql*/`
            INSERT INTO product_pickup_date (product_id, available_from, available_to)
            VALUES (${input.product_id}, ${input.available_from}, ${input.available_to})
            RETURNING *
        `;
        // console.log(productPickup);
        return transform(productPickup);
    };

    readonly getById = async (id: number, theSql = sql): Promise<Data | null> => {
        const [productPickup]: [DbData] = await theSql/*sql*/`
            SELECT * FROM product_pickup_date WHERE product_id = ${id}
        `;
        if (!productPickup) {
            return null;
        }
        return transform(productPickup);
    };
};