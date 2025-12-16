import { Router } from "express";

import ProductService from "../services/product.js";
import ConversationService from "../services/conversation.js";
import ProductPhotoService from "../services/product-photo.js";
import MessageService from "../services/message.js";

const productRouter = Router();

const productService = new ProductService();
const conversationService = new ConversationService();

const conversationRouter = Router();
conversationRouter.get("/", conversationService.getByUserId);

const messageService = new MessageService();
conversationRouter.post("/:id/messages", messageService.sendMessage);
conversationRouter.get("/:id/messages", messageService.getMessages);

productRouter.use("/conversations", conversationRouter);


const productPhotoService = new ProductPhotoService();
const photoRouter = Router();
photoRouter.post("/", productPhotoService.addAnArrayForProduct);
photoRouter.get("/", productPhotoService.getPhotosByProductId);
photoRouter.get("/download/:filename", productPhotoService.downloadPhoto);
productRouter.use("/photos", photoRouter);

productRouter.post("/", productService.add);
productRouter.get("/:id", productService.getById);
productRouter.get("/", productService.getAll);
productRouter.post("/:id/start-conversation", conversationService.start);

export default productRouter;