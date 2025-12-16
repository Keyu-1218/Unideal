import { sql } from "../db.js";
import { z } from "zod";

const Schema = z.object({
    conversation: z.number(),
    sender: z.number(),
    content: z.string().min(1),
});

type Input = z.infer<typeof Schema>;

interface Data extends Input {
    id: number;
    created_at: string;
}

export default class MessageRepository {
    readonly schema = Schema;

    readonly create = async (input: Input): Promise<Data> => {
        const [data]: [Data] = await sql`
            INSERT INTO messages (conversation, sender, content)
            VALUES (${input.conversation}, ${input.sender}, ${input.content})
            RETURNING *
        `;
        return data;
    };

    readonly readByConversation = async (conversationId: number): Promise<Data[]> => {
        const data: Data[] = await sql`
            SELECT * FROM messages WHERE conversation = ${conversationId} ORDER BY created_at ASC
        `;
        return data;
    };

}