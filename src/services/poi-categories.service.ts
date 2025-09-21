import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

import { IPoiCategory } from '../interfaces/pois.interface';

export class PoiCategoryService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all POIs category
     */
    async getAll(): Promise<IPoiCategory[]> {
        const { data, error } = await this.db.from('poi_categories').select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }
    /**
     * @desc Get POI by Id
     */
    async getById(params: { poiCategoryId: string }): Promise<IPoiCategory> {
        const { poiCategoryId } = params;
        const { data, error } = await this.db.from('poi_categories').select('*').eq('id', poiCategoryId).single();
        if (error || !data) throw new NotFoundError(`Destination with ID ${poiCategoryId} not found`);
        return data;
    }
    /**
     * @desc Create the POI category
     */

    async create(params: IPoiCategory): Promise<IPoiCategory> {
        const { name, icon, description } = params;
        const { data, error } = await this.db
            .from('poi_categories')
            .insert([{ name, icon, description }])
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }
    /**
     * @desc Update the POI category
     */

    async update(poiCategoryId: string, params: IPoiCategory): Promise<IPoiCategory> {
        const { name, icon, description } = params;
        const { data, error } = await this.db
            .from('poi_categories')
            .update({ name, icon, description })
            .eq('id', poiCategoryId)
            .select()
            .single();

        if (error || !data) throw new NotFoundError(error!.message);
        return data;
    }
    /**
     * @desc Delete the POI category
     */

    async delete(params: { poiCategoryId: string }) {
        const { poiCategoryId } = params;
        const { data, error } = await this.db.from('poi_categories').delete().eq('id', poiCategoryId).select().single();
        if (error || !data) throw new BadRequestError(error!.message);

        return data;
    }
}
