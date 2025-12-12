import { issueJwt } from "../middlewares/jwt";
import UserRepository from "../repository/users";
import { z } from "zod";
import { validateBody } from "../middlewares/data-validator";
import { hashPassword, verifyPassword } from "../password-hasher";
import { Handler } from "express";

const RegisterSchema = z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(8),
});

type RegisterInput = z.infer<typeof RegisterSchema>;

// POST /auth/register

const LoginSchema = z.object({
    email: z.email().toLowerCase(),
    password: z.string(),
});

type LoginInput = z.infer<typeof LoginSchema>;


export default class UserService {
    private readonly userRepository = new UserRepository();

    register: Handler[] = [validateBody(RegisterSchema), async (req, res) => {
        const input = (req as any).validated as RegisterInput;

        if (await this.userRepository.exists(input.email)) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const passwordHash = await hashPassword(input.password);

        const user = await this.userRepository.create({ email: input.email, passwordHash });

        // Optional: auto-sign-in after register
        const token = issueJwt(user);

        res.status(201).json({
            user,
            token,
        });
    }];

    login: Handler[] = [
        validateBody(LoginSchema), async (req, res) => {
            const input = (req as any).validated as LoginInput;

            const user = await this.userRepository.getByEmail(input.email);
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const ok = await verifyPassword(input.password, user.password_hash);
            if (!ok) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = issueJwt({ id: user.id, email: user.email });
            res.json({
                user: { id: user.id, email: user.email },
                token,
            });
        }
    ];
};