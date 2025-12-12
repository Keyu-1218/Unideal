import { sql } from "../db";

interface UserCreateInput {
    email: string;
    passwordHash: string;
}

export interface User {
    id: number;
    email: string;
}

export default class UserRepository {
    async create (input: UserCreateInput): Promise<User> {
        const [user] = await sql/*sql*/`
          INSERT INTO users (email, password_hash)
          VALUES (${input.email}, ${input.passwordHash})
          RETURNING id, email
        `;

        return { id: user.id, email: user.email };
    }

    async exists (email: string): Promise<boolean> {
        const existing = await sql/*sql*/`
          SELECT id
          FROM users
          WHERE LOWER(email) = ${email.toLowerCase()}
          LIMIT 1
        `;
        return existing && existing.length > 0;
    }

    async getByEmail (emailNorm: string): Promise<User & { password_hash: string } | null> {
        const [user]: [User & { password_hash: string }] = await sql/*sql*/`
          SELECT id, email, password_hash
          FROM users
          WHERE LOWER(email) = ${emailNorm}
          LIMIT 1
        `;
        if (!user) {
            return null;
        }

        return user;
    }

    async deleteByEmail (email: string): Promise<User | null> {
        const user = await this.getByEmail(email.toLowerCase());
        if (!user) {
            return null;
        }

        await sql/*sql*/`
            DELETE FROM users
            WHERE LOWER(email) = ${email.toLowerCase()}
        `;
        return user;
    }
};