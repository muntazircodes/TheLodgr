import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { ICreatePackage, IDBPackageRow, IUpdatePackage } from '../interfaces/packages.interface';

export class PackagesService {
    private get db(): SupabaseClient {
        return getDB();
    }

    async getAll(): Promise<IDBPackageRow[]> {
        const { data, error } = await this.db.from('packages').select('*');
        if (error) throw new BadRequestError(error.message);
        return data as IDBPackageRow[];
    }

    async getById(params: { packageId: string }): Promise<IDBPackageRow> {
        const { packageId } = params;
        const row = await this.getByIdOrThrow({ packageId });
        return row;
    }

    async create(params: ICreatePackage): Promise<IDBPackageRow> {
        const { name, description, duration_days, base_price, user_id, is_custom, is_active } = params;

        const insertPayload = Object.fromEntries(
            Object.entries({ name, description, duration_days, base_price, user_id, is_custom, is_active }).filter(
                ([_, v]) => v !== undefined
            )
        );

        const { data, error } = await this.db.from('packages').insert([insertPayload]).select().single();
        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create package');
        return data as IDBPackageRow;
    }

    async update(packageId: string, params: IUpdatePackage): Promise<IDBPackageRow> {
        await this.getByIdOrThrow({ packageId });

        const updatePayload = Object.fromEntries(
            Object.entries({
                name: params.name,
                description: params.description,
                duration_days: params.duration_days,
                base_price: params.base_price,
                user_id: params.user_id,
                is_custom: params.is_custom,
                is_active: params.is_active,
            }).filter(([_, v]) => v !== undefined)
        );

        const { data, error } = await this.db
            .from('packages')
            .update(updatePayload)
            .eq('id', packageId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update package');
        return data as IDBPackageRow;
    }

    async delete(params: { packageId: string }): Promise<void> {
        const { packageId } = params;
        await this.getByIdOrThrow({ packageId });

        const { error } = await this.db.from('packages').delete().eq('id', packageId);
        if (error) throw new BadRequestError(error.message);
        return;
    }

    private async getByIdOrThrow(params: { packageId: string }): Promise<IDBPackageRow> {
        const { packageId } = params;
        const { data, error } = await this.db.from('packages').select('*').eq('id', packageId).single();
        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Package with ID ${packageId} not found`);
        return data as IDBPackageRow;
    }
}
