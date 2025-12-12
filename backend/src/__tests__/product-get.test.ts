import axios from "axios";
import { sql } from "../db";
import { register } from "../internalAPI/auth";
import { AddProductInput } from "../repository/product/composite";
import UserRepository from "../repository/users";


describe("Get Product API", () => {
    it("Getting Products With Date Filter", async () => {
        // Get From the Endpoint
        const getResponse = await axios.get("http://localhost:5000/products?available_from=2024-07-05&available_to=2024-07-10");
        expect(getResponse.status).toBe(200);
        expect(getResponse.data).toEqual({
            "message": "List of products",
            "products": [
                {
                    "id": 2,
                    "pickup": {
                        address: {
                            "city": "Los Angeles", "country": "USA", "postal_code": "90001", "street": "456 Elm St"
                        },
                        date: {
                            "available_from": "2024-07-05", "available_to": "2024-07-15",
                        }
                    }, "price": 29.99, "short_description": "Comfortable chair", "title": "Chair",
                    photos: ["chair2.jpeg", "chair1.jpeg",]
                },
                {
                    "id": 1,
                    "pickup": {
                        "address": { "city": "New York", "country": "USA", "postal_code": "10001", "street": "123 Main St" }, "date": { "available_from": "2024-07-01", "available_to": "2024-07-10" }
                    },
                    "price": 59.99,
                    "short_description": "Really Cool Sofa",
                    "title": "Sofa",
                    photos: ["sofa3.jpeg", "sofa2.jpeg", "sofa1.jpeg",]
                }]
        });
    });

    it("Getting Products With Address Filter", async () => {
        // Get From the Endpoint
        const getResponse = await axios.get("http://localhost:5000/products?location=New York, 123 Main St&haveCar=true&travelDistance=200");
        console.debug(getResponse.data.products);

        expect(getResponse.status).toBe(200);
        expect(getResponse.data).toEqual({
            "message": "List of products",
            "products": [
                {
                    "id": 1,
                    photos: ["sofa3.jpeg", "sofa2.jpeg", "sofa1.jpeg",],
                    "pickup": {
                        "address": {
                            "city": "New York",
                            "country": "USA",
                            "postal_code": "10001",
                            "street": "123 Main St",
                        },
                        "date": {
                            "available_from": "2024-07-01",
                            "available_to": "2024-07-10",
                        },
                    },
                    "price": 59.99,
                    "short_description": "Really Cool Sofa",
                    "title": "Sofa",
                },
                {
                    "id": 6,
                    "photos": ["rug3.jpeg", "rug2.jpeg", "rug1.jpeg",],
                    "pickup": {
                        "address": {
                            "city": "Philadelphia",
                            "country": "USA",
                            "postal_code": "19101",
                            "street": "303 Birch St",
                        },
                        "date": {
                            "available_from": "2024-07-25",
                            "available_to": "2024-08-04",
                        },
                    },
                    "price": 39.99,
                    "short_description": "Cozy area rug",
                    "title": "Rug",
                },
            ]
        });
    });

    it("Getting Products With Owned Filter", async () => {
        // Add Product 
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

        const sampleUser = {
            email: "sample_user6@gmail.com",
            password: "SAMPLEJOJ",
        };

        const token = await register(sampleUser);
        const postResponse = await axios.post("http://localhost:5000/products/", productData, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        expect(postResponse.status).toBe(201);
        expect(postResponse.data).toEqual({ message: "Product created", id: expect.any(Number) });
        const createdProductId = postResponse.data.id;

        {
            const getResponse = await axios.get("http://localhost:5000/products?owned=true", {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });

            expect(getResponse.status).toBe(200);
            expect(getResponse.data).toEqual({
                "message": "List of products",
                "products": [
                    {
                        "id": createdProductId,
                        ...productData,
                        photos: [],
                    },
                ]
            });
        }

        {
            const getResponse = await axios.get("http://localhost:5000/products?owned=false", {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });

            expect(getResponse.status).toBe(200);
            expect(getResponse.data).not.toEqual({
                "message": "List of products",
                "products": [
                    {
                        "id": createdProductId,
                        ...productData,
                        photos: [],
                    },
                ]
            });
        }

        // Cleanup - Delete the created user and associated products
        await (new UserRepository()).deleteByEmail(sampleUser.email);
    });

    afterAll(async () => {
        // Close any resources if needed
        await sql.end({ timeout: 5 });
    });
});