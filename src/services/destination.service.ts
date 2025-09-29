import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import {
    IDestination,
    ICreateDestination,
    IUpdateDestination,
    IDBDestinationRow,
} from '../interfaces/destination.interface';
import { mapDbRowToDestination } from '../utils/destination.helper';

export class DestinationService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all destinations
     */
    async getAll(): Promise<IDestination[]> {
        const { data, error } = await this.db.from('destinations').select('*');
        if (error) throw new BadRequestError(error.message);
        return (data as IDBDestinationRow[]).map(mapDbRowToDestination);
    }

    /**
     * @desc Get a destination by ID
     */
    async getById(params: { destinationId: string }): Promise<IDestination> {
        const { destinationId } = params;
        const dbRow = await this.getByIdOrThrow({ destinationId });
        return mapDbRowToDestination(dbRow);
    }

    /**
     * @desc Create a new destination
     */
    async create(params: ICreateDestination): Promise<IDestination> {
        const { name, slug, area, metadata = {} } = params;

        const { data, error } = await this.db
            .from('destinations')
            .insert([{ name, slug, area, metadata }])
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error!.message);
        return mapDbRowToDestination(data as IDBDestinationRow);
    }

    /**
     * @desc Update an existing destination
     */
    async update(destinationId: string, params: IUpdateDestination): Promise<IDestination> {
        await this.getByIdOrThrow({ destinationId });

        const updatePayload = Object.fromEntries(
            Object.entries({
                name: params.name,
                slug: params.slug,
                area: params.area,
                metadata: params.metadata,
            }).filter(([_, v]) => v !== undefined)
        );

        const { data, error } = await this.db
            .from('destinations')
            .update(updatePayload)
            .eq('id', destinationId)
            .select()
            .single();

        if (error || !data) throw new BadRequestError(error!.message);
        return mapDbRowToDestination(data as IDBDestinationRow);
    }

    /**
     * @desc Delete a destination
     */
    async delete(params: { destinationId: string }): Promise<void> {
        const { destinationId } = params;
        await this.getByIdOrThrow({ destinationId });

        const { error } = await this.db.from('destinations').delete().eq('id', destinationId);

        if (error) throw new BadRequestError(error.message);
        return;
    }

    /**
     * @desc Get a destination by ID or throw NotFoundError
     */
    private async getByIdOrThrow(params: { destinationId: string }): Promise<IDBDestinationRow> {
        const { destinationId } = params;

        const { data, error } = await this.db.from('destinations').select('*').eq('id', destinationId).single();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Destination with ID ${destinationId} not found`);

        return data as IDBDestinationRow;
    }
}
