import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { IPoiWishlist } from '../interfaces/pois.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

export class PoiWishlistService {
    private get db(): SupabaseClient {
        return getDB();
    }
    /**
     * @desc Get all the wishlists of a user
     */
    async getAll(params: { poiId: string }) {
        const { poiId } = params;
        const { data, error } = await this.db.from('wishlists').select('*').eq('poi_id', poiId);
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get the wishlist by Its id
     */
    async getById(params: { wishlistId: string }) {
        const { wishlistId } = params;
        const { data, error } = await this.db.from('wishlists').select('*').eq('id', wishlistId).single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Create a wishlist of a POI
     */
    async create(params: IPoiWishlist): Promise<IPoiWishlist[]> {
        const { poi_id, user_id } = params;
        const { data, error } = await this.db.from('wishlists').insert({ poi_id, user_id }).select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Create a wishlist of a POI
     */
    async delete(params: { wishlistId: string }) {
        const { wishlistId } = params;
        const { data, error } = await this.db.from('wishlists').delete().eq('id', wishlistId).select('*');
        if (!data || error) throw new BadRequestError(error.message);
        return data;
    }
}
