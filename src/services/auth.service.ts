import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { BadRequestError, UnauthorizedError } from '@hyperflake/http-errors';

export class AuthService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Sign up a new user (email confirmation flow depends on project settings)
     * .
     */
    async signUp(params: { email: string; password: string; name?: string; phone?: string }) {
        const { email, password, name, phone } = params;

        const { data, error } = await this.db.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name ?? null,
                    phone: phone ?? null,
                },
            },
        });

        if (error) {
            throw new BadRequestError(error.message);
        }

        return data;
    }

    /**
     * @desc Login user and return session (includes access_token, refresh_token)
     */
    async login(params: { email: string; password: string }) {
        const { email, password } = params;

        const { data, error } = await this.db.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new UnauthorizedError(error.message);

        return data;
    }

    /**
     * @desc Verify Supabase token for protected endpoints
     *
     */
    async verifyToken(token: string) {
        const { data, error } = await this.db.auth.getUser(token);
        if (error || !data.user) throw new UnauthorizedError('Invalid token');
        return data.user;
    }

    /**
     * @desc Logout user
     */
    async logout() {
        const { error } = await this.db.auth.signOut();
        if (error) throw new BadRequestError(error.message);
    }
}
