import axios from "axios";
import { sql } from "../db";
import UserRepository from "../repository/users";
import { AuthInput, login, register } from "../internalAPI/auth";
import ConversationRepository from "../repository/conversation";
import { getConversations, startConversation } from "../internalAPI/products";

describe("Buy Product API", () => {
    const sampleUserInput: AuthInput = {
        email: "sample_user5@gmail.com",
        password: "SAMPLEJOJ",
    };
    const userRepository = new UserRepository();

    const conversationRepository = new ConversationRepository();

    beforeAll(async () => {
        console.log('Registering sample user');
        await register(sampleUserInput);
    });

    it("Buying Product works successfully", async () => {
        const token = await login(sampleUserInput);

        const productIdToBuy = 1;
        const postResponse = await axios.post(`http://localhost:5000/products/${productIdToBuy}/start-conversation`, {}, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });

        expect(postResponse.status).toBe(201);
        expect(postResponse.data).toEqual({ message: "Conversation created", id: expect.any(Number) });

        const createdConversationId = postResponse.data.id;
        const conversations = await getConversations(token);
        expect(conversations).toEqual([{
            buyer: expect.any(Number),
            id: createdConversationId,
            is_buyer: true,
            price: "59.99",
            product: 1,
            seller: 1,
            short_description: "Really Cool Sofa",
            title: "Sofa",
        }]);

        await conversationRepository.deleteById(postResponse.data.id);
    });

    it("Buying own Product fails", async () => {
        try {
            await startConversation(1, await login({
                email: "sample_user@gmail.com",
                password: "SAMPLE",
            }))
        } catch (error: any) {
            var postResponse = error.response;
            expect(postResponse.status).toBe(400);
            expect(postResponse.data).toEqual({ error: "Cannot buy your own product" });
            return;
        }

        throw new Error("Test did not throw as expected");
    });

    it("Common Invalid Data", async () => {
        const token = await login(sampleUserInput);

        try {
            await startConversation(1, token);
        } catch (error: any) {
            var postResponse = error.response;
            expect(postResponse.status).toBe(401);
            expect(postResponse.data).toEqual({ error: "Missing token" });
        }

        try {
            await startConversation("jj" as any, token);
        } catch (error: any) {
            var postResponse = error.response;
            expect(postResponse.status).toBe(400);
            expect(postResponse.data).toEqual({ error: "Invalid product ID" });
        }

        try {
            await startConversation(11111, token);
        } catch (error: any) {
            var postResponse = error.response;
            expect(postResponse.status).toBe(404);
            expect(postResponse.data).toEqual({ error: "Product not found" });
            return;
        }

        throw new Error("Test did not throw as expected");
    });

    it("Cannot Buy the Product Twice", async () => {
        const token = await login(sampleUserInput);
        const productIdToBuy = 10;

        const conversationId = await startConversation(productIdToBuy, token);
        try {
            await startConversation(productIdToBuy, token);
        } catch (error: any) {
            var secondPostResponse = error.response;
            expect(secondPostResponse.status).toBe(500);
            console.log("secondPostResponse.data:", typeof secondPostResponse.data);
            const expectedData = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>PostgresError: duplicate key value violates unique constraint &quot;conversations_product_buyer_key&quot;<br> &nbsp; &nbsp;at ErrorResponse (file:///app/node_modules/postgres/src/connection.js:794:26)<br> &nbsp; &nbsp;at handle (file:///app/node_modules/postgres/src/connection.js:480:6)<br> &nbsp; &nbsp;at Socket.data (file:///app/node_modules/postgres/src/connection.js:315:9)<br> &nbsp; &nbsp;at Socket.emit (node:events:508:28)<br> &nbsp; &nbsp;at addChunk (node:internal/streams/readable:559:12)<br> &nbsp; &nbsp;at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)<br> &nbsp; &nbsp;at Readable.push (node:internal/streams/readable:390:5)<br> &nbsp; &nbsp;at TCP.onStreamRead (node:internal/stream_base_commons:189:23)<br> &nbsp; &nbsp;at cachedError (file:///app/node_modules/postgres/src/query.js:170:23)<br> &nbsp; &nbsp;at new Query (file:///app/node_modules/postgres/src/query.js:36:24)<br> &nbsp; &nbsp;at sql (file:///app/node_modules/postgres/src/index.js:112:11)<br> &nbsp; &nbsp;at ConversationRepository.create (/app/src/repository/conversation.ts:23:38)</pre>
</body>
</html>
`;
            expect(secondPostResponse.data).toEqual(expectedData);
            await conversationRepository.deleteById(conversationId)

            return;
        }

        await conversationRepository.deleteById(conversationId)
        throw new Error("Test did not throw as expected");
    });

    afterAll(async () => {
        await userRepository.deleteByEmail(sampleUserInput.email);

        // Close any resources if needed
        await sql.end({ timeout: 5 });
    });
});