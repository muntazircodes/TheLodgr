import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { ICreateTransportBooking, ITransportBooking, IUpdateTransportBooking } from '../interfaces/transport.interface';

export class TransportBookingService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all transport bookings
     */
    async getAll(): Promise<ITransportBooking[]> {
        const { data, error } = await this.db.from('transport_bookings').select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get transport booking by ID
     */
    async getById(params: { bookingId: string }): Promise<ITransportBooking> {
        const { bookingId } = params;
        const data = await this.getByIdOrThrow({ bookingId });
        return data;
    }

    /**
     * @desc Get transport bookings by user ID
     */
    async getByUserId(params: { userId: string }): Promise<ITransportBooking[]> {
        const { userId } = params;
        const { data, error } = await this.db.from('transport_bookings').select('*').eq('user_id', userId);
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get transport bookings by vehicle ID
     */
    async getByVehicleId(params: { vehicleId: string }): Promise<ITransportBooking[]> {
        const { vehicleId } = params;
        const { data, error } = await this.db.from('transport_bookings').select('*').eq('vehicle_id', vehicleId);
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Create a transport booking
     */
    async create(params: ICreateTransportBooking): Promise<ITransportBooking> {
        const {
            vehicle_id,
            user_id,
            package_id,
            driver_id,
            start_date,
            end_date,
            pickup_location,
            drop_location,
            total_price,
            status,
        } = params;
        const { data, error } = await this.db
            .from('transport_bookings')
            .insert([
                {
                    vehicle_id,
                    user_id,
                    package_id,
                    driver_id,
                    start_date,
                    end_date,
                    pickup_location,
                    drop_location,
                    total_price,
                    status: status || 'pending',
                },
            ])
            .select()
            .single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }

    /**
     * @desc Update a transport booking
     */
    async update(bookingId: string, params: IUpdateTransportBooking): Promise<ITransportBooking> {
        // Ensure booking exists before updating
        await this.getByIdOrThrow({ bookingId });

        const {
            vehicle_id,
            user_id,
            package_id,
            driver_id,
            start_date,
            end_date,
            pickup_location,
            drop_location,
            total_price,
            status,
        } = params;

        const { data, error } = await this.db
            .from('transport_bookings')
            .update({
                vehicle_id,
                user_id,
                package_id,
                driver_id,
                start_date,
                end_date,
                pickup_location,
                drop_location,
                total_price,
                status,
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (error || !data)
            throw new NotFoundError(error?.message || `Transport booking with ID ${bookingId} not found`);

        return data;
    }

    /**
     * @desc Delete a transport booking
     */
    async delete(params: { bookingId: string }): Promise<ITransportBooking> {
        const { bookingId } = params;

        // Ensure booking exists before deleting
        await this.getByIdOrThrow({ bookingId });

        const { data, error } = await this.db.from('transport_bookings').delete().eq('id', bookingId).select().single();

        if (error || !data) throw new BadRequestError(error!.message);
        return data;
    }

    /**
     * @desc Helper - Get booking by ID or throw
     */
    private async getByIdOrThrow(params: { bookingId: string }): Promise<ITransportBooking> {
        const { bookingId } = params;
        const { data, error } = await this.db.from('transport_bookings').select('*').eq('id', bookingId).single();
        if (error || !data) throw new NotFoundError(`Transport booking with ID ${bookingId} not found`);
        return data;
    }
}
