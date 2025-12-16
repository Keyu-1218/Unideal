import { Product } from "../repository/product/product.js";
import { sql } from "../db.js";
import { ProductPickupAddress } from "../repository/product/pickup-address.js";
import { DistanceMatrixLocation, getDistanceMatrix } from "../externalAPI/google-maps.js";

export const filter = async (products: Product[], location?: string, haveCar: boolean = true, travelDistance?: number): Promise<Product[]> => {
    if (!location || !travelDistance) {
        return products;
    }

    products = products.sort((a, b) => a.id - b.id);
    let product_ids = products.map(p => p.id);
    // console.debug("product ids:", product_ids);

    let product_addresses: ProductPickupAddress[] = await sql/*sql*/`
        SELECT * FROM product_pickup_address
        WHERE product_id IN ${sql(product_ids)}
    `;
    product_addresses = product_addresses.sort((a, b) => a.product_id - b.product_id);

    const origins: DistanceMatrixLocation[] = [
        { type: "address", address: location }
    ];

    const destinations: DistanceMatrixLocation[] = product_addresses.map(addr => ({
        type: "address",
        address: `${addr.street}, ${addr.city}, ${addr.postal_code}, ${addr.country}`
    }));
    // console.debug("destinations:", destinations);

    // TODO consider "have Car" on the request
    const distanceMatrix = await getDistanceMatrix(origins, destinations);
    distanceMatrix.sort((a, b) => a.destinationIndex - b.destinationIndex);
    const isProductIndexValid = distanceMatrix.map((distance) => {
        if (distance.condition !== 'ROUTE_EXISTS') {
            return false;
        }
        if (distance.distanceMeters / 1000 > travelDistance) {
            return false;
        }
        // TODO duration filter
        return true;
    })
    // console.debug("Distance Matrix:", distanceMatrix);
    // console.debug("Is Product Index Valid:", isProductIndexValid);

    products = products.filter((_, index) => isProductIndexValid[index]);

    return products;
}