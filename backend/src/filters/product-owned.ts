import ProductRepository, { Product } from "../repository/product/product.js";

export const filter = async (products: Product[], sellerId?: number): Promise<Product[]> => {
    if (!sellerId) {
        return products;
    }

    const productRepository = new ProductRepository();
    const sellers: number[] = [];
    for (const product of products) {
        const seller = await productRepository.readSeller(product.id);
        sellers.push(seller!);
    }
    products = products.filter((_, index) => sellers[index] === sellerId);
    return products;
};