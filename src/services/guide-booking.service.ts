import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { ICreateGuideBooking, IUpdateGuideBooking } from '../interfaces/guide.interface';

export class GuideBookingService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all guide bookings
     */
    async getAllBookings() {
        const { data, error } = await this.db
            .from('guide_bookings')
            .select(
                `
                *,
                guides (
                    id,
                    name,
                    phone,
                    email,
                    rating
                ),
                user_profiles (
                    id,
                    name,
                    phone_primary
                )
                `
            )
            .order('created_at', { ascending: false });

        if (error) throw new BadRequestError(error.message);

        return data;
    }

    /**
     * @desc Get a guide booking by ID
     */
    async getById(params: { bookingId: string }) {
        const { bookingId } = params;

        const { data, error } = await this.db
            .from('guide_bookings')
            .select(
                `
                *,
                guides (
                    id,
                    name,
                    phone,
                    email,
                    rating
                ),
                user_profiles (
                    id,
                    name,
                    phone_primary
                )
                `
            )
            .eq('id', bookingId)
            .single();

        if (error) throw new NotFoundError(error.message);

        return data ;
    }

    /**
     * @desc Get guide bookings by user ID
     */
    async getByUserId(params: { userId: string }) {
        const { userId } = params;

        const { data, error } = await this.db
            .from('guide_bookings')
            .select(
                `
                *,
                guides (
                    id,
                    name,
                    phone,
                    email,
                    rating
                )
                `
            )
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new BadRequestError(error.message);

        return { data };
    }

    /**
     * @desc Get guide bookings by guide ID
     */
    async getByGuideId(params: { guideId: string }) {
        const { guideId } = params;

        const { data, error } = await this.db
            .from('guide_bookings')
            .select(
                `
                *,
                user_profiles (
                    id,
                    name,
                    phone_primary
                )
                `
            )
            .eq('guide_id', guideId)
            .order('created_at', { ascending: false });

        if (error) throw new BadRequestError(error.message);

        return data;
    }

    /**
     * @desc Create a new guide booking
     */
    async create(params: ICreateGuideBooking) {
        const {
            guide_id,
            user_id,
            package_id,
            poi_id,
            start_date,
            end_date,
            group_size,
            total_price,
            status = 'pending',
        } = params;

        const { data, error } = await this.db
            .from('guide_bookings')
            .insert([
                {
                    guide_id,
                    user_id,
                    package_id,
                    poi_id,
                    start_date,
                    end_date,
                    group_size,
                    total_price,
                    status,
                },
            ])
            .select()
            .single();

        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Update a guide booking
     */
    async update(bookingId: string, params: IUpdateGuideBooking) {
        const { guide_id, user_id, package_id, poi_id, start_date, end_date, group_size, total_price, status } = params;

        await this.getByIdOrThrow({ bookingId });

        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (guide_id !== undefined) updateData.guide_id = guide_id;
        if (user_id !== undefined) updateData.user_id = user_id;
        if (package_id !== undefined) updateData.package_id = package_id;
        if (poi_id !== undefined) updateData.poi_id = poi_id;
        if (start_date !== undefined) updateData.start_date = start_date;
        if (end_date !== undefined) updateData.end_date = end_date;
        if (group_size !== undefined) updateData.group_size = group_size;
        if (total_price !== undefined) updateData.total_price = total_price;
        if (status !== undefined) updateData.status = status;

        const { data, error } = await this.db
            .from('guide_bookings')
            .update(updateData)
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Delete a guide booking
     */
    async delete(params: { bookingId: string }) {
        const { bookingId } = params;

        await this.getByIdOrThrow({ bookingId });

        const { data, error } = await this.db.from('guide_bookings').delete().eq('id', bookingId).select().single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Update booking status
     */
    async updateStatus(params: { bookingId: string; status: 'pending' | 'confirmed' | 'cancelled' }) {
        const { bookingId, status } = params;

        await this.getByIdOrThrow({ bookingId });

        const { data, error } = await this.db
            .from('guide_bookings')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get booking by ID or throw NotFoundError
     */
    private async getByIdOrThrow(params: { bookingId: string }) {
        const { bookingId } = params;

        const { data, error } = await this.db.from('guide_bookings').select('id').eq('id', bookingId).single();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Guide booking with ID ${bookingId} not found`);

        return data;
    }
}
