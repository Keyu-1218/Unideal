import { Handler } from "express";
import ProductRepository from "../repository/product/product";
import ConversationRepository from "../repository/conversation";
import { jwtMiddleware } from "../middlewares/jwt";

export default class ConversationService {
    private readonly productRepository = new ProductRepository();
    private readonly conversationRepository = new ConversationRepository();

    readonly start: Handler[] = [jwtMiddleware(), async (req, res) => {
        const productId = parseInt(req.params.id, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const product = await this.productRepository.readById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const buyerId = req.user!.id;
        const productSellerId = await this.productRepository.readSeller(productId);
        // product.seller != buyer
        if (productSellerId === buyerId) {
            return res.status(400).json({ error: "Cannot buy your own product" });
        }

        // create conversation
        const conversation = await this.conversationRepository.create({
            product: productId,
            buyer: buyerId,
        });

        res.status(201).json({ message: "Conversation created", id: conversation.id });
    }];

    readonly getByUserId: Handler[] = [jwtMiddleware(), async (req, res) => {
        const userId = req.user!.id;
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const conversations = await this.conversationRepository.readByUser(userId);

        res.json({ conversations });
    }];
};