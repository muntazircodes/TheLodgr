import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { IActivityBooking } from '../interfaces/activities.interface';

export class ActivityBookingService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all activity bookings (optionally filter by activity)
     */
    async getAll(params?: { activityId?: string }): Promise<IActivityBooking[]> {
        const { activityId } = params || {};
        let query = this.db.from('activity_bookings').select('*');
        if (activityId) query = query.eq('activity_id', activityId);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get activity booking by ID
     */
    async getById(params: { bookingId: string }): Promise<IActivityBooking> {
        const { bookingId } = params;
        const data = await this.getByIdOrThrow({ bookingId });
        return data;
    }

    /**
     * @desc Create activity booking
     */
    async create(params: IActivityBooking): Promise<IActivityBooking> {
        const { activity_id, user_id, package_id, booking_date, participants, total_price, status } = params;

        const { data, error } = await this.db
            .from('activity_bookings')
            .insert([
                {
                    activity_id,
                    user_id,
                    package_id,
                    booking_date,
                    participants,
                    total_price,
                    status: status ?? 'pending',
                },
            ])
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create Activity Booking');
        return data;
    }

    /**
     * @desc Update activity booking
     */
    async update(
        bookingId: string,
        params: Partial<
            Pick<IActivityBooking, 'package_id' | 'booking_date' | 'participants' | 'total_price' | 'status'>
        >
    ): Promise<IActivityBooking> {
        await this.getByIdOrThrow({ bookingId });

        const { package_id, booking_date, participants, total_price, status } = params;
        const updateData: Partial<
            Pick<IActivityBooking, 'package_id' | 'booking_date' | 'participants' | 'total_price' | 'status'>
        > & {
            updated_at: string;
        } = {
            updated_at: new Date().toISOString(),
        };

        if (package_id !== undefined) updateData.package_id = package_id;
        if (booking_date !== undefined) updateData.booking_date = booking_date;
        if (participants !== undefined) updateData.participants = participants;
        if (total_price !== undefined) updateData.total_price = total_price;
        if (status !== undefined) updateData.status = status;

        const { data, error } = await this.db
            .from('activity_bookings')
            .update(updateData)
            .eq('id', bookingId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update Activity Booking');
        return data;
    }

    /**
     * @desc Delete activity booking
     */
    async delete(params: { bookingId: string }): Promise<IActivityBooking> {
        const { bookingId } = params;
        await this.getByIdOrThrow({ bookingId });

        const { data, error } = await this.db.from('activity_bookings').delete().eq('id', bookingId).select().single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to delete Activity Booking');
        return data;
    }

    /**
     * @desc Update booking status
     */
    async updateStatus(params: {
        bookingId: string;
        status: 'pending' | 'confirmed' | 'cancelled';
    }): Promise<IActivityBooking> {
        const { bookingId, status } = params;
        await this.getByIdOrThrow({ bookingId });

        const { data, error } = await this.db
            .from('activity_bookings')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', bookingId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update Activity Booking status');
        return data;
    }

    /**
     * @desc Get booking by ID or throw
     */
    private async getByIdOrThrow(params: { bookingId: string }): Promise<IActivityBooking> {
        const { bookingId } = params;
        const { data, error } = await this.db.from('activity_bookings').select('*').eq('id', bookingId).maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Activity Booking with ID ${bookingId} not found`);
        return data;
    }
}
