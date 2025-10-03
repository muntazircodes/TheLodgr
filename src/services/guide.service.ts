import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { ICreateGuide, IUpdateGuide } from '../interfaces/guide.interface';

export class GuideService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all guides
     */
    async getAllGuides() {
        const { data, error } = await this.db.from('guides').select('*').order('created_at', { ascending: false });
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get a guide by ID
     */
    async getById(params: { guideId: string }) {
        const { guideId } = params;
        const data = await this.getByIdOrThrow({ guideId });
        return data;
    }

    /**
     * @desc Create a new guide
     */
    async create(params: ICreateGuide) {
        const { name, phone, email, license_number, languages = [], specialties = [], is_active = true } = params;

        const { data, error } = await this.db
            .from('guides')
            .insert([
                {
                    name,
                    phone,
                    email,
                    license_number,
                    languages,
                    specialties,
                    is_active,
                },
            ])
            .select()
            .single();

        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Update a guide
     */
    async update(guideId: string, params: IUpdateGuide) {
        const { name, phone, email, license_number, languages, specialties, is_active } = params;
        await this.getByIdOrThrow({ guideId });
        const { data, error } = await this.db
            .from('guides')
            .update({ name, phone, email, license_number, languages, specialties, is_active })
            .eq('id', guideId)
            .select()
            .single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Delete a guide
     */
    async delete(params: { guideId: string }) {
        const { guideId } = params;

        await this.getByIdOrThrow({ guideId });

        const { data, error } = await this.db.from('guides').delete().eq('id', guideId).select().single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get guides by specialty
     */
    async getBySpecialty(params: { specialty: string }) {
        const { specialty } = params;

        const { data, error } = await this.db
            .from('guides')
            .select('*')
            .contains('specialties', [specialty])
            .eq('is_active', true)
            .order('rating', { ascending: false });

        if (error) throw new BadRequestError(error.message);

        return data;
    }

    /**
     * @desc Get guides by language
     */
    async getByLanguage(params: { language: string }) {
        const { language } = params;

        const { data, error } = await this.db
            .from('guides')
            .select('*')
            .contains('languages', [language])
            .eq('is_active', true)
            .order('rating', { ascending: false });

        if (error) throw new BadRequestError(error.message);

        return data;
    }

    /**
     * @desc Get guide by ID or throw NotFoundError
     */
    private async getByIdOrThrow(params: { guideId: string }) {
        const { guideId } = params;

        const { data, error } = await this.db.from('guides').select('id').eq('id', guideId).single();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Guide with ID ${guideId} not found`);

        return data;
    }
}
