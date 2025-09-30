import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { IPoiWishlist } from '../interfaces/pois.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

export class PoiWishlistService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all the wishlists of a POI
     */
    async getAll(params: { poiId: string }): Promise<IPoiWishlist[]> {
        const { poiId } = params;
        const { data, error } = await this.db.from('wishlists').select('*').eq('poi_id', poiId);

        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get wishlist by ID
     */
    async getById(params: { wishlistId: string }): Promise<IPoiWishlist> {
        const data = this.getByIdOrThrow(params.wishlistId);
        return data;
    }

    /**
     * @desc Create a wishlist entry for a POI
     */
    async create(params: IPoiWishlist): Promise<IPoiWishlist> {
        const { poi_id, user_id } = params;
        const { data, error } = await this.db.from('wishlists').insert({ poi_id, user_id }).select('*').single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create wishlist');
        return data;
    }

    /**
     * @desc Delete a wishlist entry
     */
    async delete(params: { wishlistId: string }): Promise<IPoiWishlist> {
        // Ensure it exists before deletion
        await this.getByIdOrThrow(params.wishlistId);

        const { data, error } = await this.db
            .from('wishlists')
            .delete()
            .eq('id', params.wishlistId)
            .select('*')
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to delete wishlist');
        return data;
    }

    /**
     * @desc Get wishlist by ID or throw error
     */
    private async getByIdOrThrow(wishlistId: string): Promise<IPoiWishlist> {
        const { data, error } = await this.db.from('wishlists').select('*').eq('id', wishlistId).maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Wishlist with ID ${wishlistId} not found`);

        return data;
    }
}
