import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import {
    ICreatePackageComponent,
    IDBPackageComponentRow,
    IUpdatePackageComponent,
} from '../interfaces/packages.interface';

export class PackageComponentsService {
    private get db(): SupabaseClient {
        return getDB();
    }

    async listByPackage(params: { packageId: string }): Promise<IDBPackageComponentRow[]> {
        const { packageId } = params;
        const { data, error } = await this.db.from('package_components').select('*').eq('package_id', packageId);
        if (error) throw new BadRequestError(error.message);
        return data as IDBPackageComponentRow[];
    }

    async getById(params: { componentId: string; packageId?: string }): Promise<IDBPackageComponentRow> {
        const row = await this.getByIdOrThrow(params);
        return row;
    }

    async create(params: ICreatePackageComponent): Promise<IDBPackageComponentRow> {
        const { package_id, component_type, component_id, quantity, price, meta } = params;

        const insertPayload = Object.fromEntries(
            Object.entries({ package_id, component_type, component_id, quantity, price, meta }).filter(
                ([_, v]) => v !== undefined
            )
        );

        const { data, error } = await this.db.from('package_components').insert([insertPayload]).select().single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to create package component');
        return data as IDBPackageComponentRow;
    }

    async update(componentId: string, params: IUpdatePackageComponent): Promise<IDBPackageComponentRow> {
        await this.getByIdOrThrow({ componentId });

        const updatePayload = Object.fromEntries(
            Object.entries({
                component_type: params.component_type,
                component_id: params.component_id,
                quantity: params.quantity,
                price: params.price,
                meta: params.meta,
            }).filter(([_, v]) => v !== undefined)
        );

        const { data, error } = await this.db
            .from('package_components')
            .update(updatePayload)
            .eq('id', componentId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error?.message || 'Failed to update package component');
        return data as IDBPackageComponentRow;
    }

    async delete(params: { componentId: string }): Promise<void> {
        const { componentId } = params;
        await this.getByIdOrThrow({ componentId });

        const { error } = await this.db.from('package_components').delete().eq('id', componentId);
        if (error) throw new BadRequestError(error.message);
        return;
    }

    private async getByIdOrThrow(params: { componentId: string; packageId?: string }): Promise<IDBPackageComponentRow> {
        const { componentId, packageId } = params;
        let query = this.db.from('package_components').select('*').eq('id', componentId);
        if (packageId) query = query.eq('package_id', packageId);

        const { data, error } = await query.maybeSingle();
        if (error) throw new BadRequestError(error.message);
        if (!data)
            throw new NotFoundError(
                `Package component with ID ${componentId}${packageId ? ` under package ${packageId}` : ''} not found`
            );
        return data as IDBPackageComponentRow;
    }
}
