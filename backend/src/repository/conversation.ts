import { sql } from "../db.js";
import { z } from "zod";
import { Product } from "./product/product.js";

const Schema = z.object({
    product: z.number(),
    buyer: z.number(),
});

type Input = z.infer<typeof Schema>;

interface Data extends Input {
    id: number;
}

interface UserConversation extends Data, Product {
    is_buyer: boolean;
};

export default class ConversationRepository {

    readonly create = async (input: Input): Promise<Data> => {
        const [data]: [Data] = await sql`
            INSERT INTO conversations (product, buyer)
            VALUES (${input.product}, ${input.buyer})
            RETURNING *
        `;
        return data;
    }

    readonly readById = async (id: number): Promise<Data | null> => {
        const [data]: [Data | undefined] = await sql`
            SELECT * FROM conversations WHERE id = ${id}
        `;
        return data || null;
    };

    readonly deleteById = async (id: number): Promise<void> => {
        await sql`
            DELETE FROM conversations WHERE id = ${id}
        `;
    };

    readonly readByUser = async (userId: number): Promise<any[]> => {
        const data = await sql`
            SELECT 
                products.*,
                conversations.*,
                conversations.id AS id,
                (conversations.buyer = ${userId}) AS is_buyer,
                json_build_object(
                    'id', b.id,
                    'username', b.email
                ) as buyer,
                json_build_object(
                    'id', s.id,
                    'username', s.email
                ) as seller
            FROM conversations
            JOIN products ON conversations.product = products.id
            JOIN users b ON conversations.buyer = b.id
            JOIN users s ON products.seller = s.id
            WHERE conversations.buyer = ${userId} OR products.seller = ${userId}
        `;
        return data;
    }
}