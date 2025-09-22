import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { IPoiRating } from '../interfaces/pois.interface';

export class PoiRatingService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all the ratings of a POI
     */
    async getAllRatings(params: { poiId: string }) {
        const { poiId } = params;
        const { data, error } = await this.db.from('poi_ratings').select('*').eq('poi_id', poiId);
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get the rating of a POI by its rating ID
     */
    async getById(params: { ratingId: string }) {
        const { ratingId } = params;
        const { data, error } = await this.db.from('poi_ratings').select('*').eq('id', ratingId).single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Create a rating for a POI and update the POI's average rating and total ratings
     */
    async create(params: IPoiRating): Promise<IPoiRating[]> {
        const { poi_id, user_id, rating, review, images, visit_date } = params;

        const { data, error } = await this.db
            .from('poi_ratings')
            .insert([{ poi_id, user_id, rating, review, images, visit_date }])
            .select('*');

        if (error) throw new BadRequestError(error.message);

        await this.updatePoiAggregate(poi_id);

        return data;
    }

    /**
     * @desc Update a rating for a POI and update the POI's average rating and total ratings
     */
    async update(ratingId: string, params: Partial<IPoiRating>): Promise<IPoiRating> {
        // Get the existing rating to fetch poi_id
        const { data: existing, error: fetchError } = await this.db
            .from('poi_ratings')
            .select('*')
            .eq('id', ratingId)
            .single();

        if (fetchError || !existing) throw new NotFoundError('Rating not found');

        const { data, error } = await this.db
            .from('poi_ratings')
            .update(params)
            .eq('id', ratingId)
            .select('*')
            .single();

        if (error) throw new BadRequestError(error.message);

        await this.updatePoiAggregate(existing.poi_id);

        return data;
    }

    /**
     * @desc Delete a rating for a POI and update the POI's average rating and total ratings
     */
    async delete(ratingId: string): Promise<{ success: boolean }> {
        // Get the existing rating to fetch poi_id
        const { data: existing, error: fetchError } = await this.db
            .from('poi_ratings')
            .select('*')
            .eq('id', ratingId)
            .single();

        if (fetchError || !existing) throw new NotFoundError('Rating not found');

        const { error } = await this.db.from('poi_ratings').delete().eq('id', ratingId);

        if (error) throw new BadRequestError(error.message);

        await this.updatePoiAggregate(existing.poi_id);

        return { success: true };
    }

    /**
     * @desc Helper to update POI's average rating and total ratings
     */
    private async updatePoiAggregate(poi_id: string) {
        const { data: ratings, error: ratingsError } = await this.db
            .from('poi_ratings')
            .select('rating')
            .eq('poi_id', poi_id);

        if (ratingsError) throw new BadRequestError(ratingsError.message);

        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
        const averageRating = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(2)) : 0;

        const { error: poiUpdateError } = await this.db
            .from('pois')
            .update({
                average_rating: averageRating,
                total_ratings: totalRatings,
            })
            .eq('id', poi_id);

        if (poiUpdateError) throw new BadRequestError(poiUpdateError.message);
    }
}
