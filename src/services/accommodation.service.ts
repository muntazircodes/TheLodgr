import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { IAccommodation, ICreateAccommodation, IUpdateAccommodation } from '../interfaces/accommodation.interface';

export class AccommodationService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all accommodations for a destination
     */
    async getAll(destinationId: string): Promise<IAccommodation[]> {
        const { data, error } = await this.db.from('accommodations').select('*').eq('destination_id', destinationId);
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get accommodation by ID
     */
    async getById(id: string): Promise<IAccommodation> {
        const data = this.getByIdOrThrow(id);
        return data;
    }

    /**
     * @desc Create a new accommodation
     */
    async create(params: ICreateAccommodation): Promise<IAccommodation> {
        const { data, error } = await this.db.from('accommodations').insert([params]).select().single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create accommodation');
        return data;
    }

    /**
     * @desc Update an existing accommodation
     */
    async update(id: string, params: IUpdateAccommodation): Promise<IAccommodation> {
        await this.getByIdOrThrow(id);
        const { data, error } = await this.db.from('accommodations').update(params).eq('id', id).select().single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update accommodation');
        return data;
    }

    /**
     * @desc Delete an accommodation by ID
     */
    async delete(id: string): Promise<void> {
        await this.getByIdOrThrow(id);
        const { error } = await this.db.from('accommodations').delete().eq('id', id);
        if (error) throw new BadRequestError(error.message);
    }

    /**
     * @desc Get accommodation by ID or throw error if not found
     */
    private async getByIdOrThrow(id: string): Promise<IAccommodation> {
        const { data, error } = await this.db.from('accommodations').select('*').eq('id', id).maybeSingle();
        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Accommodation with ID ${id} not found`);
        return data;
    }
}
