import { NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { IUser } from '../interfaces/user.inteface';

export class UserService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Create the profile for user
     */
    async getAllUsers() {
        const { data } = await this.db.from('userProfiles').select('*');
        return { data };
    }

    /**
     * @desc Get a user profile by ID (returns null if not found)
     */
    async getById(params: { userId: string }) {
        const { userId } = params;

        const { data, error } = await this.db.from('userProfiles').select('*').eq('id', userId).single();

        return { data, error };
    }

    /**
     * @desc Create the profile for user
     */
    async create(params: {
        id?: string;
        name: string;
        profile?: string;
        aadhaar_number: string;
        address_line1: string;
        address_line2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        phone_primary: string;
        phone_alternate?: string;
    }) {
        const {
            id,
            name,
            profile,
            aadhaar_number,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            phone_primary,
            phone_alternate,
        } = params;

        if (!id) {
            throw new NotFoundError('The user Id is not passed please check');
        }

        const { data, error } = await this.db
            .from('userProfiles')
            .insert([
                {
                    id,
                    name,
                    profile,
                    aadhaar_number,
                    address_line1,
                    address_line2,
                    city,
                    state,
                    postal_code,
                    country,
                    phone_primary,
                    phone_alternate,
                },
            ])
            .select()
            .single();

        return {
            data,
            error,
        };
    }

    /**
     * @desc Update the profile for a user
     */
    async update(params: {
        id?: string;
        name?: string;
        profile?: string;
        aadhaar_number?: string;
        address_line1?: string;
        address_line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
        phone_primary?: string;
        phone_alternate?: string;
    }) {
        const {
            id,
            name,
            profile,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            phone_primary,
            phone_alternate,
        } = params;

        if (!id) {
            throw new NotFoundError('The user Id is not passed, please check');
        }

        await this.getByIdOrThrow({ userId: id });

        const { data, error } = await this.db
            .from('userProfiles')
            .update({
                name,
                profile,
                address_line1,
                address_line2,
                city,
                state,
                postal_code,
                country,
                phone_primary,
                phone_alternate,
                updated_at: new Date().toISOString(), // keep schema in sync
            })
            .eq('id', id)
            .select()
            .single();

        return {
            data,
            error,
        };
    }

    /**
     * @desc Delete the profile for a user
     */
    async delete(params: { userId: string }) {
        const { userId } = params;

        await this.getByIdOrThrow({ userId });

        const { data } = await this.db.from('userProfiles').delete().eq('id', userId).select().single();

        return data;
    }

    /**
     * @desc Get a user profile by ID or throw NotFoundError if not found
     */
    private async getByIdOrThrow(params: { userId: string }) {
        const { userId } = params;

        const { data, error } = await this.db.from('userProfiles').select('*').eq('id', userId).single();

        if (error || !data) {
            throw new NotFoundError(`User with ID ${userId} not found`);
        }

        return data;
    }
}
