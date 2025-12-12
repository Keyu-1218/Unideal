import { login, AuthInput, register } from "../internalAPI/auth";
import { startConversation } from "../internalAPI/products";
import { getMessages, sendMessage } from "../internalAPI/conversation";
import UserRepository from "../repository/users";
import { sql } from "../db";
import ConversationRepository from "../repository/conversation";

describe("Message API", () => {
    const sampleUserInput: AuthInput = {
        email: "sample_user2@gmail.com",
        password: "SAMPLEJOJ",
    };
    const sampleUserInput2: AuthInput = {
        email: "sample_user3@gmail.com",
        password: "SAMPLEJOJ",
    };
    const userRepository = new UserRepository();

    const conversationRepository = new ConversationRepository();
    let conversationId: number;

    beforeAll(async () => {
        console.log('Registering sample user');
        await register(sampleUserInput);
        await register(sampleUserInput2);

        conversationId = await startConversation(1, await login(sampleUserInput));
    });

    it("Sending and Getting Messages works successfully", async () => {
        const token = await login(sampleUserInput);

        const messageContent = "Hello, is this still available?";
        const response = await sendMessage({
            conversation: conversationId,
            content: messageContent,
        }, token);

        expect(response.status).toBe(201);
        expect(response.data).toEqual({ message: "Message sent" });

        const messages = await getMessages(conversationId, token);
        expect(messages.length).toBe(1);
        expect(messages[0]).toMatchObject({
            conversation: conversationId,
            sender: expect.any(Number),
            content: messageContent,
        });
    });

    it("Invalid Sending Message Data", async () => {
        // sender is not provided by token
        try {
            await sendMessage({
                conversation: 1,
                content: "Hello",
            });
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(401);
            expect(response.data).toEqual({ error: "Missing token" });
        }

        // Invalid conversation ID type
        try {
            await sendMessage({
                conversation: NaN,
                content: "Hello",
            }, await login(sampleUserInput));
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(400);
            expect(response.data).toEqual({ error: "Invalid conversation ID" });
        }

        // 9999 is assumed to be non-existent
        try {
            await sendMessage({
                conversation: 9999,
                content: "Hello",
            }, await login(sampleUserInput));
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(404);
            expect(response.data).toEqual({ error: "Conversation not found" });
        }

        // sender is not a participant in the conversation
        try {
            await sendMessage({
                conversation: conversationId,
                content: "Hello",
            }, await login(sampleUserInput2));
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(403);
            expect(response.data).toEqual({ error: "Not a participant in this conversation" });
            return;
        }

        throw new Error("Test did not throw as expected");
    });

    it("Invalid Getting Messages Data", async () => {
        // sender is not provided by token
        try {
            await getMessages(1);
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(401);
            expect(response.data).toEqual({ error: "Missing token" });
        }

        // Invalid conversation ID type
        try {
            await getMessages(NaN, await login(sampleUserInput));
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(400);
            expect(response.data).toEqual({ error: "Invalid conversation ID" });
        }

        // 9999 is assumed to be non-existent
        try {
            await getMessages(9999, await login(sampleUserInput));
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(404);
            expect(response.data).toEqual({ error: "Conversation not found" });
        }

        // sender is not a participant in the conversation
        try {
            await getMessages(conversationId, await login(sampleUserInput2));
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toBe(403);
            expect(response.data).toEqual({ error: "Not a participant in this conversation" });

            return;
        }

        throw new Error("Test did not throw as expected");
    });

    afterAll(async () => {
        await userRepository.deleteByEmail(sampleUserInput.email);
        await userRepository.deleteByEmail(sampleUserInput2.email);

        await conversationRepository.deleteById(conversationId);
        // Close any resources if needed
        await sql.end({ timeout: 5 });
    });
});