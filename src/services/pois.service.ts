import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

import { IPoi } from '../interfaces/pois.interface';

export class PoiService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all POIs of a destinations
     */

    async getAll(params: { destinationId: string }): Promise<IPoi[]> {
        const { destinationId } = params;
        const { data, error } = await this.db.from('pois').select('*').eq('destination_id', destinationId);
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get a POI by its Id and destinationId
     */
    async getById(params: { destinationId: string; poiId: string }): Promise<IPoi> {
        const { destinationId, poiId } = params;
        const { data, error } = await this.db
            .from('pois')
            .select('*')
            .eq('id', poiId)
            .eq('destination_id', destinationId)
            .single();
        if (error || !data) throw new NotFoundError(`POI with ID ${poiId} not found in destination ${destinationId}`);
        return data;
    }
    /**
     * @desc Create a POI
     */
    async create(params: IPoi) {
        const {
            destination_id,
            name,
            description,
            category_id,
            latitude,
            longitude,
            elevation,
            address,
            contact_info,
            opening_hours,
            images,
            is_active,
            max_zoom,
            min_zoom,
            priority,
        } = params;
        const { data, error } = await this.db
            .from('pois')
            .insert([
                {
                    destination_id,
                    name,
                    description,
                    category_id,
                    latitude,
                    longitude,
                    elevation,
                    address,
                    contact_info,
                    opening_hours,
                    images,
                    is_active,
                    max_zoom,
                    min_zoom,
                    priority,
                },
            ])
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }
    /**
     * @desc Update a POI
     */
    async update(poiId: string, params: Omit<IPoi, 'id' | 'destination_id' | 'category_id'>) {
        const {
            name,
            description,
            latitude,
            longitude,
            elevation,
            address,
            contact_info,
            opening_hours,
            images,
            is_active,
            max_zoom,
            min_zoom,
            priority,
        } = params;
        const { data, error } = await this.db
            .from('pois')
            .update({
                name,
                description,
                latitude,
                longitude,
                elevation,
                address,
                contact_info,
                opening_hours,
                images,
                is_active,
                max_zoom,
                min_zoom,
                priority,
            })
            .eq('id', poiId)
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }
    /**
     * @desc Delete a POI
     */
    async delete(params: { poiId: string }) {
        const { poiId } = params;
        const { data, error } = await this.db.from('pois').delete().eq('id', poiId).select().single();

        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }
}
