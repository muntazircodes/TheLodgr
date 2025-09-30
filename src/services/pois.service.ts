import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

import { IPoi } from '../interfaces/pois.interface';

export class PoiService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all POIs of a destination
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
        return await this.getByIdOrThrow(params.poiId, params.destinationId);
    }

    /**
     * @desc Create a POI
     */
    async create(params: IPoi): Promise<IPoi> {
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

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create POI');
        return data;
    }

    /**
     * @desc Update a POI
     */
    async update(poiId: string, params: Omit<IPoi, 'id' | 'destination_id' | 'category_id'>): Promise<IPoi> {
        // Ensure record exists first
        await this.getByIdOrThrow(poiId);

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

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update POI');
        return data;
    }

    /**
     * @desc Delete a POI
     */
    async delete(params: { poiId: string }): Promise<IPoi> {
        // Ensure record exists first
        await this.getByIdOrThrow(params.poiId);

        const { data, error } = await this.db.from('pois').delete().eq('id', params.poiId).select().single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to delete POI');
        return data;
    }

    /**
     * @desc Get POI by Id (optionally scoped by destination) or throw error
     */
    private async getByIdOrThrow(poiId: string, destinationId?: string): Promise<IPoi> {
        let query = this.db.from('pois').select('*').eq('id', poiId);

        if (destinationId) {
            query = query.eq('destination_id', destinationId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!data) {
            const scopeMsg = destinationId ? ` in destination ${destinationId}` : '';
            throw new NotFoundError(`POI with ID ${poiId} not found${scopeMsg}`);
        }

        return data;
    }
}
