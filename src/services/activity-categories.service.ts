import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

import { IActivityCategory } from '../interfaces/activities.interface';

export class ActivityCategoryService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all activity categories
     */
    async getAll(): Promise<IActivityCategory[]> {
        const { data, error } = await this.db.from('activity_categories').select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get activity category by Id
     */
    async getById(params: { categoryId: string }): Promise<IActivityCategory> {
        const { categoryId } = params;
        const data = await this.getByIdOrThrow({ categoryId });
        return data;
    }

    /**
     * @desc Create activity category
     */
    async create(params: IActivityCategory): Promise<IActivityCategory> {
        const { name, description, icon } = params;
        const { data, error } = await this.db
            .from('activity_categories')
            .insert([{ name, description, icon }])
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create Activity Category');
        return data;
    }

    /**
     * @desc Update activity category
     */
    async update(categoryId: string, params: IActivityCategory): Promise<IActivityCategory> {
        await this.getByIdOrThrow({ categoryId });

        const { name, description, icon } = params;
        const { data, error } = await this.db
            .from('activity_categories')
            .update({ name, description, icon })
            .eq('id', categoryId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update Activity Category');
        return data;
    }

    /**
     * @desc Delete activity category
     */
    async delete(params: { categoryId: string }): Promise<IActivityCategory> {
        const { categoryId } = params;
        await this.getByIdOrThrow({ categoryId });

        const { data, error } = await this.db
            .from('activity_categories')
            .delete()
            .eq('id', categoryId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to delete Activity Category');
        return data;
    }

    /**
     * @desc Get activity category by Id or throw error
     */
    private async getByIdOrThrow(params: { categoryId: string }): Promise<IActivityCategory> {
        const { categoryId } = params;
        const { data, error } = await this.db
            .from('activity_categories')
            .select('*')
            .eq('id', categoryId)
            .maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Activity Category with ID ${categoryId} not found`);

        return data;
    }
}
