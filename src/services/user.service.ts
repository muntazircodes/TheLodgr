import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { IUser } from '../interfaces/user.inteface';

export class UserService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all user profiles with roles
     */
    async getAllUsers() {
        const { data, error } = await this.db.from('user_profiles').select(
            `
                *,
                user_roles (
                    roles ( name )
                )
                `
        );

        if (error) throw new BadRequestError(error.message);

        const users = data?.map((u: any) => ({
            ...u,
            roles: u.user_roles?.map((ur: any) => ur.roles.name) ?? [],
        }));

        return users;
    }

    /**
     * @desc Get a user profile by ID with roles
     */
    async getById(params: { userId: string }) {
        const { userId } = params;

        const { data, error } = await this.db
            .from('user_profiles')
            .select(
                `
                *,
                user_roles (
                    roles ( name )
                )
                `
            )
            .eq('id', userId)
            .single();

        if (error) throw new NotFoundError(error.message);

        const user = {
            ...data,
            roles: data.user_roles?.map((ur: any) => ur.roles.name) ?? [],
        };

        return user;
    }

    /**
     * @desc Create a user profile (roles handled separately in user_roles)
     */
    async create(params: IUser) {
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
            .from('user_profiles')
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

        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Update a user profile (roles handled separately in user_roles)
     */
    async update(userId: string, params: IUser) {
        const {
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

        await this.getByIdOrThrow({ userId });

        const { data, error } = await this.db
            .from('user_profiles')
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
                updated_at: new Date().toISOString(), // redundant but okay
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Delete a user profile
     */
    async delete(params: { userId: string }) {
        const { userId } = params;

        await this.getByIdOrThrow({ userId });

        const { data, error } = await this.db.from('user_profiles').delete().eq('id', userId).select().single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get user by ID or throw NotFoundError
     */
    private async getByIdOrThrow(params: { userId: string }) {
        const { userId } = params;

        const { data, error } = await this.db.from('user_profiles').select('id').eq('id', userId).single();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`User with ID ${userId} not found`);

        return data;
    }
}
