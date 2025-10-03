import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

import { IActivity } from '../interfaces/activities.interface';

export class ActivityService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all activities for a destination
     */
    async getAll(params: { destinationId: string }): Promise<IActivity[]> {
        const { destinationId } = params;
        const { data, error } = await this.db.from('activities').select('*').eq('destination_id', destinationId);
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get an activity by its Id (optionally scoped by destination)
     */
    async getById(params: { activityId: string; destinationId?: string }): Promise<IActivity> {
        const data = await this.getByIdOrThrow(params);
        return data;
    }

    /**
     * @desc Create an activity
     */
    async create(params: IActivity): Promise<IActivity> {
        const {
            destination_id,
            poi_id,
            category_id,
            name,
            description,
            image_url,
            duration_minutes,
            capacity,
            difficulty,
            requirements,
            base_price,
            price_type,
            is_active,
        } = params;

        const { data, error } = await this.db
            .from('activities')
            .insert([
                {
                    destination_id,
                    poi_id,
                    category_id,
                    name,
                    description,
                    image_url,
                    duration_minutes,
                    capacity,
                    difficulty,
                    requirements,
                    base_price,
                    price_type,
                    is_active,
                },
            ])
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create Activity');
        return data;
    }

    /**
     * @desc Update an activity
     */
    async update(
        activityId: string,
        params: Omit<IActivity, 'id' | 'destination_id' | 'category_id' | 'poi_id'>
    ): Promise<IActivity> {
        await this.getByIdOrThrow({ activityId });

        const {
            name,
            description,
            image_url,
            duration_minutes,
            capacity,
            difficulty,
            requirements,
            base_price,
            price_type,
            is_active,
        } = params;

        const { data, error } = await this.db
            .from('activities')
            .update({
                name,
                description,
                image_url,
                duration_minutes,
                capacity,
                difficulty,
                requirements,
                base_price,
                price_type,
                is_active,
            })
            .eq('id', activityId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update Activity');
        return data;
    }

    /**
     * @desc Delete an activity
     */
    async delete(params: { activityId: string }): Promise<IActivity> {
        const { activityId } = params;
        await this.getByIdOrThrow({ activityId });

        const { data, error } = await this.db.from('activities').delete().eq('id', activityId).select().single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to delete Activity');
        return data;
    }

    /**
     * @desc Get activity by Id (optionally scoped by destination) or throw
     */
    private async getByIdOrThrow(params: { activityId: string; destinationId?: string }): Promise<IActivity> {
        const { activityId, destinationId } = params;
        let query = this.db.from('activities').select('*').eq('id', activityId);
        if (destinationId) query = query.eq('destination_id', destinationId);

        const { data, error } = await query.maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!data) {
            const scopeMsg = destinationId ? ` in destination ${destinationId}` : '';
            throw new NotFoundError(`Activity with ID ${activityId} not found${scopeMsg}`);
        }
        return data;
    }
}
