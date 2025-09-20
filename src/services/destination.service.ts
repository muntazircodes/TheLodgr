import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';

export class DestinationService {
    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Get all destinations
     */
    async getAllDestinations() {
        const { data, error } = await this.db.from('destinations').select('*');
        if (error) throw new BadRequestError(error.message);
        return { data };
    }

    /**
     * @desc Get a destination by ID (returns null if not found)
     */
    async getById(params: { destinationId: string }) {
        const { destinationId } = params;
        const { data, error } = await this.db.from('destinations').select('*').eq('id', destinationId).single();
        if (error) throw new NotFoundError(error.message);
        return { data };
    }

    /**
     * @desc Create a new destination
     */
    async create(params: {
        name: string;
        slug: string;
        area: object; // Should be GeoJSON Polygon or WKT, see client usage
        center: object; // Should be GeoJSON Point or WKT, see client usage
        metadata?: any;
    }) {
        const { name, slug, area, center, metadata = {} } = params;

        // Insert expects geometry types for area and center
        const { data, error } = await this.db
            .from('destinations')
            .insert([
                {
                    name,
                    slug,
                    area,
                    center,
                    metadata,
                },
            ])
            .select()
            .single();

        if (error) throw new BadRequestError(error.message);
        return { data };
    }

    /**
     * @desc Update a destination by ID
     */
    async update(params: { id: string; name?: string; slug?: string; area?: object; center?: object; metadata?: any }) {
        const { id, name, slug, area, center, metadata } = params;

        if (!id) {
            throw new NotFoundError('The destination id is not passed, please check');
        }

        await this.getByIdOrThrow({ destinationId: id });

        const { data, error } = await this.db
            .from('destinations')
            .update({
                name,
                slug,
                area,
                center,
                metadata,
                updated_at: new Date().toISOString(), // keep schema in sync
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new BadRequestError(error.message);
        return { data };
    }

    /**
     * @desc Delete a destination by ID
     */
    async delete(params: { destinationId: string }) {
        const { destinationId } = params;

        await this.getByIdOrThrow({ destinationId });

        const { data, error } = await this.db.from('destinations').delete().eq('id', destinationId).select().single();
        if (error) throw new BadRequestError(error.message);
        return data;
    }

    /**
     * @desc Get a destination by ID or throw NotFoundError if not found
     */
    private async getByIdOrThrow(params: { destinationId: string }) {
        const { destinationId } = params;

        const { data, error } = await this.db.from('destinations').select('id').eq('id', destinationId).single();

        if (error) throw new BadRequestError(error.message);
        if (!data) throw new NotFoundError(`Destination with ID ${destinationId} not found`);

        return data;
    }
}
