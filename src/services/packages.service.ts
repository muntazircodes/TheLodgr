import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { ICreatePackage, IDBPackageRow, IUpdatePackage } from '../interfaces/packages.interface';

export class PackagesService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all packages
     */
    async getAll(): Promise<IDBPackageRow[]> {
        const { data, error } = await this.db.from('packages').select('*');
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get package by ID
     */
    async getById({ packageId }: { packageId: string }): Promise<IDBPackageRow> {
        const data = await this.getByIdOrThrow({ packageId });
        return data;
    }

    /**
     * @desc Get package by ID
     */
    async create(params: ICreatePackage): Promise<IDBPackageRow> {
        const insertPayload = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));

        const { data, error } = await this.db.from('packages').insert([insertPayload]).select('*').single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create package');
        return data;
    }

    /**
     * @desc Update existing package
     */
    async update(packageId: string, params: IUpdatePackage): Promise<IDBPackageRow> {
        await this.getByIdOrThrow({ packageId });

        const updatePayload = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));

        const { data, error } = await this.db
            .from('packages')
            .update(updatePayload)
            .eq('id', packageId)
            .select('*')
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update package');
        return data;
    }

    /**
     * @desc Delete package by ID
     */
    async delete({ packageId }: { packageId: string }): Promise<void> {
        await this.getByIdOrThrow({ packageId });

        const { error } = await this.db.from('packages').delete().eq('id', packageId);
        if (error) throw new BadRequestError(error.message);
        return;
    }

    /**
     *  @desc Internal: Get package by ID or throw
     */
    private async getByIdOrThrow({ packageId }: { packageId: string }): Promise<IDBPackageRow> {
        const { data, error } = await this.db.from('packages').select('*').eq('id', packageId).maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Package with ID ${packageId} not found`);

        return data;
    }
}
