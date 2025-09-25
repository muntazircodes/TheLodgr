import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { IPrice } from '../interfaces/price.interface';

export class PriceService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all prices
     */
    async getAll(): Promise<IPrice[]> {
        const { data, error } = await this.db.from('prices').select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get price by ID
     */
    async getById(params: { priceId: string }): Promise<IPrice> {
        const { priceId } = params;
        const { data, error } = await this.db.from('prices').select('*').eq('id', priceId).single();
        if (error) throw new NotFoundError(`Price with ID ${priceId} not found`);
        return data;
    }

    /**
     * @desc Create the price
     */
    async create(params: IPrice): Promise<IPrice[]> {
        const { entity_type, entity_id, price, tier, effective_from, effective_to } = params;
        const { data, error } = await this.db
            .from('prices')
            .insert([{ entity_type, entity_id, price, tier, effective_from, effective_to }])
            .select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Update a price by ID
     */
    async update(params: { priceId: string; update: Partial<IPrice> }): Promise<IPrice> {
        const { priceId, update } = params;
        // Ensure the price exists
        await this.getById({ priceId });
        const { data, error } = await this.db.from('prices').update(update).eq('id', priceId).select('*').single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Delete a price by ID
     */
    async delete(params: { priceId: string }): Promise<{ success: boolean }> {
        const { priceId } = params;
        // Ensure the price exists
        await this.getById({ priceId });
        const { error } = await this.db.from('prices').delete().eq('id', priceId);
        if (error) throw new BadRequestError(error.message);
        return { success: true };
    }
}
