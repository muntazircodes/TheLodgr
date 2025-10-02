import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { ICreateTransportVehicle, ITransportVehicle, IUpdateTransportVehicle } from '../interfaces/transport.interface';

export class TransportVehicleService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all transport vehicles
     */
    async getAll(): Promise<ITransportVehicle[]> {
        const { data, error } = await this.db.from('transport_vehicles').select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get transport vehicle by ID
     */
    async getById(params: { vehicleId: string }): Promise<ITransportVehicle> {
        const { vehicleId } = params;
        return this.getByIdOrThrow(vehicleId);
    }

    /**
     * @desc Create a transport vehicle
     */
    async create(params: ICreateTransportVehicle): Promise<ITransportVehicle> {
        const { name, type, brand, model, license_plate, capacity, features, image_url, base_price, price_per_km } =
            params;
        const { data, error } = await this.db
            .from('transport_vehicles')
            .insert([
                {
                    name,
                    type,
                    brand,
                    model,
                    license_plate,
                    capacity,
                    features: features || [],
                    image_url,
                    base_price,
                    price_per_km,
                    is_active: true,
                },
            ])
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }

    /**
     * @desc Update a transport vehicle
     */
    async update(vehicleId: string, params: IUpdateTransportVehicle): Promise<ITransportVehicle> {
        const {
            name,
            type,
            brand,
            model,
            license_plate,
            capacity,
            features,
            image_url,
            base_price,
            price_per_km,
            is_active,
        } = params;

        const { data, error } = await this.db
            .from('transport_vehicles')
            .update({
                name,
                type,
                brand,
                model,
                license_plate,
                capacity,
                features: features || [],
                image_url,
                base_price,
                price_per_km,
                is_active,
            })
            .eq('id', vehicleId)
            .select()
            .single();

        if (error || !data)
            throw new NotFoundError(error?.message || `Transport vehicle with ID ${vehicleId} not found`);

        return data;
    }

    /**
     * @desc Delete a transport vehicle
     */
    async delete(params: { vehicleId: string }): Promise<ITransportVehicle> {
        const { vehicleId } = params;
        const { data, error } = await this.db.from('transport_vehicles').delete().eq('id', vehicleId).select().single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }

    /**
     * @desc Helper - Get vehicle by ID or throw
     */
    private async getByIdOrThrow(vehicleId: string): Promise<ITransportVehicle> {
        const { data, error } = await this.db.from('transport_vehicles').select('*').eq('id', vehicleId).single();
        if (error || !data) throw new NotFoundError(`Transport vehicle with ID ${vehicleId} not found`);
        return data;
    }
}
