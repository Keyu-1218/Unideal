import { sql } from "../db";
import { z } from "zod";
import { Product } from "./product/product";

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

    readonly readByUser = async (userId: number): Promise<UserConversation[]> => {
        const data: UserConversation[] = await sql`
            SELECT *,
                conversations.id AS id,
                (buyer = ${userId}) AS is_buyer
            FROM conversations
            JOIN products ON conversations.product = products.id
            WHERE buyer = ${userId} OR products.seller = ${userId}
        `;
        return data;
    }
}