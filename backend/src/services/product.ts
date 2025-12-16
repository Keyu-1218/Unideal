import { jwtMiddleware } from "../middlewares/jwt.js";
import { validateBody } from "../middlewares/data-validator.js";

import ComplexProductRepository, { AddProductInput } from "../repository/product/composite.js";
import ProductRepository from "../repository/product/product.js";

import { Handler } from "express";

import { filter as filterByPickupDate } from "../filters/product-pickup-date.js";
import { filter as filterByPickupAddress } from "../filters/product-pickup-address.js";
import { filter as filterByOwned } from "../filters/product-owned.js";
import { sql } from "../db.js";

export default class ProductService {
    private readonly productRepository = new ProductRepository();
    private readonly complexProductRepository = new ComplexProductRepository();

    readonly add: Handler[] = [jwtMiddleware(), validateBody(this.complexProductRepository.schema.omit({ seller: true })), async (req, res) => {
        const input = (req as any).validated as Omit<AddProductInput, 'seller'>;

        const input2 = {
            ...input,
            seller: req.user!.id
        } as AddProductInput;

        const productId = await this.complexProductRepository.create(input2).catch(err => {
            console.error("Error creating product:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        });

        res.status(201).json({ message: "Product created", id: productId });
    }];

    readonly getById: Handler = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }   

        const product = await this.complexProductRepository.readById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product details", product: product });
    };

    readonly getAll: Handler[] = [jwtMiddleware(false), async (req, res) => {
        let products = await this.productRepository.readAll();

        const query = req.query;
        products = await filterByPickupDate(products, query.available_from as string, query.available_to as string);

        products = await filterByPickupAddress(
            products,
            query.location as string,
            query.haveCar === 'true',
            query.travelDistance ? parseFloat(query.travelDistance as string) : undefined
        );

        const sellerId = req.user ? req.user.id : undefined;
        products = await filterByOwned(
            products,
            query.owned === 'true' ? sellerId : undefined,
        );

        // Filter out own products and dibsed products from homepage (unless includeAllProducts is true)
        if (query.owned !== 'true' && query.includeAllProducts !== 'true') {
            try {
                // Get all product IDs that have been dibsed (have conversations)
                const dibsedProducts = await sql`
                    SELECT DISTINCT product FROM conversations
                `;
                const dibsedProductIds = new Set(
                    dibsedProducts.map((row: any) => row.product)
                );

                const productRepository = new ProductRepository();
                const filteredProducts = [];
                
                for (const product of products) {
                    // Skip dibsed products
                    if (dibsedProductIds.has(product.id)) {
                        continue;
                    }
                    
                    // Skip own products if user is logged in
                    if (sellerId) {
                        const productSeller = await productRepository.readSeller(product.id);
                        if (productSeller === sellerId) {
                            continue;
                        }
                    }
                    
                    filteredProducts.push(product);
                }
                products = filteredProducts;
            } catch (err) {
                console.error("Error filtering products:", err);
                // If filtering fails, continue with unfiltered products
            }
        }

        const productIds = products.map(p => p.id);
        let complexProducts = [];

        for (const id of productIds) {
            const complexProduct = await this.complexProductRepository.readById(id);
            if (!complexProduct) {
                throw new Error(`Complex product not found for ID ${id}`);
            }
            complexProducts.push(complexProduct);
        }

        res.json({ message: "List of products", products: complexProducts });
    }];
};
