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
    async getById(params: { accommodationId: string }): Promise<IAccommodation> {
        const { accommodationId } = params;
        const data = this.getByIdOrThrow({ accommodationId });
        return data;
    }

    /**
     * @desc Create a new accommodation
     */
    async create(params: ICreateAccommodation): Promise<IAccommodation> {
        const { destination_id, name, type, description, price_per_night, capacity, amenities, images, is_active } =
            params;
        const { data, error } = await this.db
            .from('accommodations')
            .insert([
                { destination_id, name, type, description, price_per_night, capacity, amenities, images, is_active },
            ])
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create accommodation');
        return data;
    }

    /**
     * @desc Update an existing accommodation
     */
    async update(accommodationId: string, params: IUpdateAccommodation): Promise<IAccommodation> {
        await this.getByIdOrThrow({ accommodationId });
        const { name, type, description, price_per_night, capacity, amenities, images, is_active } = params;
        const { data, error } = await this.db
            .from('accommodations')
            .update({ name, type, description, price_per_night, capacity, amenities, images, is_active })
            .eq('id', accommodationId)
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update accommodation');
        return data;
    }

    /**
     * @desc Delete an accommodation by ID
     */
    async delete(params: { accommodationId: string }): Promise<void> {
        const { accommodationId } = params;
        await this.getByIdOrThrow({ accommodationId });
        const { error } = await this.db.from('accommodations').delete().eq('id', accommodationId);
        if (error) throw new BadRequestError(error.message);
    }

    /**
     * @desc Get accommodation by ID or throw error if not found
     */
    private async getByIdOrThrow(params: { accommodationId: string }): Promise<IAccommodation> {
        const { accommodationId } = params;
        const { data, error } = await this.db
            .from('accommodations')
            .select('*')
            .eq('id', accommodationId)
            .maybeSingle();
        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Accommodation with ID ${accommodationId} not found`);
        return data;
    }
}
