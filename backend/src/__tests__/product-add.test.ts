import axios from "axios";
import { sql } from "../db";

import ProductPickupDateRepository from "../repository/product/pickup-date";
import ProductPickupAddressRepository from "../repository/product/pickup-address";
import ProductRepository from "../repository/product/product";
import { AddProductInput } from "../repository/product/composite";

describe("Add Product API", () => {
    const login = async (): Promise<string> => {
        const response = await axios.post("http://localhost:5000/auth/login", {
            email: "sample_user@gmail.com",
            password: "SAMPLE",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.token;
    };

    const productRepository = new ProductRepository();
    const productPickupDateRepository = new ProductPickupDateRepository();
    const productPickupAddressRepository = new ProductPickupAddressRepository();

    it("Adding Product works successfully", async () => {
        const productData: Omit<AddProductInput, 'seller'> = {
            title: "Test Product",
            short_description: "This is a test product",
            price: 49.99,
            pickup: {
                date: {
                    available_from: "2024-08-01",
                    available_to: "2024-08-15",
                },
                address: {
                    country: "USA",
                    city: "New York",
                    street: "123 Main St",
                    postal_code: "10001",
                },
            },
        }

        const token = await login();
        const postResponse = await axios.post("http://localhost:5000/products/", productData, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });

        expect(postResponse.status).toBe(201);
        expect(postResponse.data).toEqual({ message: "Product created", id: expect.any(Number) });
        const createdProductId = postResponse.data.id;
        console.debug("Created Product ID:", createdProductId);

        // Verify pickup date
        expect(await productRepository.readById(createdProductId)).toEqual({
            id: createdProductId,
            title: productData.title,
            short_description: productData.short_description,
            price: productData.price,
        });

        expect(await productPickupDateRepository.getById(createdProductId)).toEqual({
            product_id: createdProductId,
            ...productData.pickup.date,
        });

        // Verify pickup address
        expect(await productPickupAddressRepository.getByProductId(createdProductId)).toEqual({
            product_id: createdProductId,
            ...productData.pickup.address,
        });

        // Clean up
        await sql/*sql*/`
            DELETE FROM products WHERE id = ${createdProductId}
        `;
    });

    it("Adding Product without token fails", async () => {
        try {
            await axios.post("http://localhost:5000/products/", {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error: any) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual({ error: "Missing token" });
        }
    });

    it("Adding Corrupt Product Fails", async () => {
        const corruptProductData = {
            title: "TP", // too short
            short_description: "Short", // too short
            price: -10, // negative price
        };

        const token = await login();

        try {
            await axios.post("http://localhost:5000/products/", corruptProductData, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
            });
        } catch (error: any) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toHaveProperty('error', 'Invalid data');
            expect(error.response.data).toHaveProperty('details');
            expect(Array.isArray(error.response.data.details)).toBe(true);
            expect(error.response.data.details.length).toBeGreaterThan(0);
        }

        // Verify the product was not created
        const product = await sql/*sql*/`
            SELECT * FROM products WHERE title = ${corruptProductData.title}
        `;
        expect(product.length).toBe(0);
    });

    it("Adding Product With Invalid Pickup Fails", async () => {
        const invalidPickupProductData = {
            title: "Valid Title",
            short_description: "This is a valid short description",
            price: 29.99,
            pickup: {
                date: {
                    available_from: "2024-09-10",
                    available_to: 0
                },
                address: {
                    country: "USA",
                    city: "New York",
                    street: "123 Main St",
                    postal_code: "10001",
                },
            },
        };

        const token = await login();

        try {
            await axios.post("http://localhost:5000/products/", invalidPickupProductData, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
            });
        } catch (error: any) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toHaveProperty('error', 'Invalid data');
            expect(error.response.data).toHaveProperty('details');
            expect(Array.isArray(error.response.data.details)).toBe(true);
            expect(error.response.data.details.length).toBeGreaterThan(0);
        }

        // Verify the product was not created
        const product = await sql/*sql*/`
            SELECT * FROM products WHERE title = ${invalidPickupProductData.title}
        `;
        expect(product.length).toBe(0);

        // Verify Product Pickup Date was not created
        const pickupDate = await sql/*sql*/`
            SELECT * FROM product_pickup_date WHERE product_id = (SELECT id FROM products WHERE title = ${invalidPickupProductData.title} LIMIT 1)
        `;
        expect(pickupDate.length).toBe(0);

        // Verify Product Pickup Address was not created
        const pickupAddress = await sql/*sql*/`
            SELECT * FROM product_pickup_address WHERE product_id = (SELECT id FROM products WHERE title = ${invalidPickupProductData.title} LIMIT 1)
        `;
        expect(pickupAddress.length).toBe(0);
    });

    afterAll(async () => {
        // Close any resources if needed
        await sql.end({ timeout: 5 });
    });
});