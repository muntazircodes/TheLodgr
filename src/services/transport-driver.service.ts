import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { ICreateTransportDriver, ITransportDriver, IUpdateTransportDriver } from '../interfaces/transport.interface';

export class TransportDriverService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all transport drivers
     */
    async getAll(): Promise<ITransportDriver[]> {
        const { data, error } = await this.db.from('transport_drivers').select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get transport driver by ID
     */
    async getById(params: { driverId: string }): Promise<ITransportDriver> {
        const { driverId } = params;
        return this.getByIdOrThrow(driverId);
    }

    /**
     * @desc Create a transport driver
     */
    async create(params: ICreateTransportDriver): Promise<ITransportDriver> {
        const { name, phone, license_number, languages, is_active } = params;
        const { data, error } = await this.db
            .from('transport_drivers')
            .insert([
                {
                    name,
                    phone,
                    license_number,
                    languages: languages || [],
                    is_active: is_active ?? true,
                },
            ])
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }

    /**
     * @desc Update a transport driver
     */
    async update(driverId: string, params: IUpdateTransportDriver): Promise<ITransportDriver> {
        const { name, phone, license_number, languages, is_active } = params;

        const { data, error } = await this.db
            .from('transport_drivers')
            .update({
                name,
                phone,
                license_number,
                languages: languages || [],
                is_active,
            })
            .eq('id', driverId)
            .select()
            .single();

        if (error || !data) throw new NotFoundError(error?.message || `Transport driver with ID ${driverId} not found`);

        return data;
    }

    /**
     * @desc Delete a transport driver
     */
    async delete(params: { driverId: string }): Promise<ITransportDriver> {
        const { driverId } = params;
        const { data, error } = await this.db.from('transport_drivers').delete().eq('id', driverId).select().single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }

    /**
     * @desc Helper - Get driver by ID or throw
     */
    private async getByIdOrThrow(driverId: string): Promise<ITransportDriver> {
        const { data, error } = await this.db.from('transport_drivers').select('*').eq('id', driverId).single();
        if (error || !data) throw new NotFoundError(`Transport driver with ID ${driverId} not found`);
        return data;
    }
}
