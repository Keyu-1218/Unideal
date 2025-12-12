import axios from "axios";
import { sql } from "../db";

import ProductRepository from "../repository/product/product";
import ProductPhotoRepository from "../repository/product/photo";

describe("Product Photos API", () => {
    const productRepository = new ProductRepository();
    const productPhotoRepository = new ProductPhotoRepository();

    it("Uploading Product Photo works successfully", async () => {
        // create sample product first
        const product = await productRepository.create({
            seller: 1,
            title: "Photo Test Product",
            short_description: "Product for testing photo upload",
            price: 19.99,
        });

        // post photo to the product
        // TODO: should be a photo file, not a normal file
        const formData = new FormData();
        formData.append("product_id", product.id.toString());
        const fileBlob = new Blob(["Test file content"], { type: "text/plain" });
        formData.append("files", fileBlob, "test-photo.txt");

        let postResponse;
        try {
            postResponse = await axios.post("http://localhost:5000/products/photos/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error: any) {
            console.error("Error uploading product photo:", error.response || error);
            throw error;
        }
        expect(postResponse.status).toBe(201);
        expect(postResponse.data).toEqual({ message: "Files uploaded successfully" });

        // verify photo is linked to product
        let getResponse;
        try {
            console.log("Fetching photos for product ID:", product.id);
            getResponse = await axios.get(`http://localhost:5000/products/photos/?product_id=${product.id}`);
        } catch (error: any) {
            console.error("Error fetching product photos:", error.response || error);
            throw error;
        }
        expect(getResponse.status).toBe(200);
        expect(getResponse.data).toEqual({
            message: "List of photos",
            photos: [
                {
                    id: expect.any(Number),
                    product_id: product.id,
                    photo_url: expect.any(String),
                },
            ],
        });

        // verify downloaded photo content is correct
        const photoFilename = getResponse.data.photos[0].photo_url;
        const downloadResponse = await axios.get(`http://localhost:5000/products/photos/download/${photoFilename}`, {
            responseType: 'blob',
        });
        expect(downloadResponse.status).toBe(200);
        const downloadedText = await downloadResponse.data;
        expect(downloadedText).toBe("Test file content");

        // delete files from uploads folder if needed
        await productPhotoRepository.deleteByProductId(product.id);

        // Clean up - delete the created product and associated photos
        await productRepository.deleteById(product.id);
    });

    afterAll(async () => {
        // Close any resources if needed
        await sql.end({ timeout: 5 });
    });
});