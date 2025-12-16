import { Handler } from "express";
import MessageRepository from "../repository/message.js";
import { jwtMiddleware } from "../middlewares/jwt.js";
import { validateBody } from "../middlewares/data-validator.js";
import ConversationRepository from "../repository/conversation.js";
import ProductRepository from "../repository/product/product.js";


export default class MessageService {
    private readonly productRepository = new ProductRepository();
    private readonly conversationRepository = new ConversationRepository();
    private readonly messageRepository = new MessageRepository();

    private readonly messageValidator: Handler = async (req, res, next) => {
        const conversationId = parseInt(req.params.id, 10);
        if (isNaN(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation ID" });
        }

        const conversation = await this.conversationRepository.readById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const userId = req.user!.id;
        const conversationSeller = await this.productRepository.readSeller(conversation.product);
        if (![conversation.buyer, conversationSeller].includes(userId)) {
            return res.status(403).json({ error: "Not a participant in this conversation" });
        }

        req.body = req.body || {};
        req.body.conversation = conversationId;
        req.body.sender = userId;
        next();
    };

    sendMessage: Handler[] = [jwtMiddleware(), this.messageValidator, validateBody(this.messageRepository.schema), async (req, res) => {
        const input = (req as any).validated as Parameters<MessageRepository["create"]>[0];

        await this.messageRepository.create(input);

        res.status(201).json({ message: "Message sent" });
    }];

    getMessages: Handler[] = [jwtMiddleware(), this.messageValidator, async (req, res) => {
        const messages = await this.messageRepository.readByConversation(req.body.conversation);

        res.json({ messages });
    }];
}