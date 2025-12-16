import { unlink } from "node:fs/promises";
import { sql } from '../../db.js';

interface Input {
    product_id: number;
    photo_url: string;
}

export interface ProductPhoto extends Input {
    id: number;
};

export default class ProductPhotoRepository {
    readonly create = async (input: Input, theSql = sql): Promise<ProductPhoto> => {
        const [photo] = await sql/*sql*/`
            INSERT INTO product_photos (product_id, photo_url)
            VALUES (${input.product_id}, ${input.photo_url})
            RETURNING id, product_id, photo_url
        `;
        return photo as ProductPhoto;
    };

    readonly readById = async (id: number, theSql = sql): Promise<ProductPhoto | null> => {
        const [photo] = await sql/*sql*/`
            SELECT id, product_id, photo_url
            FROM product_photos
            WHERE id = ${id}
        `;
        if (!photo) {
            return null;
        }
        return photo as ProductPhoto;
    };

    readonly readByProductId = async (product_id: number, theSql = sql): Promise<ProductPhoto[]> => {
        const photos = await sql/*sql*/`
            SELECT id, product_id, photo_url
            FROM product_photos
            WHERE product_id = ${product_id}
            ORDER BY id DESC
        `;
        if (!photos) {
            return [];
        }
        return photos as unknown as ProductPhoto[];
    };

    readonly deleteByProductId = async (product_id: number): Promise<void> => {
        // console.debug('delete photos by productId called');
        const photos = await this.readByProductId(product_id);
        if (photos.length === 0) {
            return;
        }

        for (const photo of photos) {
            await this.deleteById(photo.id);
        }
    };

    readonly deleteById = async (id: number): Promise<void> => {
        const photo = await this.readById(id);
        if (!photo) {
            return;
        }

        // console.debug(`deleting photo with id ${id}`);

        // delete file as well
        try {
            const filePath = process.env.UPLOAD_DIR + photo.photo_url;
            await unlink(filePath);
            console.debug(`Deleted file ${filePath}`);
        } catch (err) {
            throw Error(`Error deleting file: ${err}`);
        }

        await sql/*sql*/`
            DELETE FROM product_photos
            WHERE id = ${id}
        `;
    };
};