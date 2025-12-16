import { Handler } from "express";

import { z } from "zod";
import { validateBody } from "../middlewares/data-validator.js";
import multer from "multer";
import path from "path";
import ProductPhotoRepository from "../repository/product/photo.js";

const PhotoSchema = z.object({
    product_id: z.string().regex(/^\d+$/).transform(Number),
});

type PhotoInput = z.infer<typeof PhotoSchema>;

const productPhotoRepository = new ProductPhotoRepository();

// Set up multer for handling file uploads
const upload = multer({ dest: process.env.UPLOAD_DIR || "uploads/" }); // Files will be saved to 'uploads/' directory

// TODO check the user. the owner only can add photos
export default class ProductPhotoService {
    addAnArrayForProduct: Handler[] = [upload.array("files"), validateBody(PhotoSchema), async (req, res) => {
        try {
            const input = (req as any).validated as PhotoInput;

            const files = req.files as Express.Multer.File[] | undefined;

            if (!files || (Array.isArray(files) && files.length === 0)) {
                return res.status(400).json({ error: "No Files Uploaded" });
            }

            for (const file of files) {
                await productPhotoRepository.create({ product_id: input.product_id, photo_url: file.filename });
                // console.log(`Uploaded file: ${file.originalname} to ${file.path}`);
            }

            res.status(201).json({ message: "Files uploaded successfully" });
        } catch (error) {
            console.error("Error in addAnArrayForProduct:", error);
            res.status(500).json({ error: "Internal Server Error", details: error });
        }
    }];

    getPhotosByProductId: Handler = async (req, res) => {
        console.log("Received request for product photos with query:", req.query);
        const product_id = Number(req.query.product_id);
        if (isNaN(product_id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const photos = await productPhotoRepository.readByProductId(product_id);
        res.json({ message: "List of photos", photos: photos });
    };

    downloadPhoto: Handler = (req, res) => {
        const uploadDir = process.env.UPLOAD_DIR || "uploads";
        const filePath = path.resolve(uploadDir, req.params.filename);
        res.sendFile(filePath, err => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(404).send("File not found");
            }
        });
    };
};