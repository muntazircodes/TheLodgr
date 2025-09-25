import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDB } from '../configuration/database.config';
import { IGeneratePackageParams, IPackage, IPackageBreakdown, IPackageQuote } from '../interfaces/packages.interface';
import { PriceService } from './price.service';

export class PackagesService {
    private get db(): SupabaseClient {
        return getDB();
    }

    private readonly priceService = new PriceService();

    async getAll(params: { userId: string }): Promise<IPackage[]> {
        const { userId } = params;
        const { data, error } = await this.db.from('packages').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (error) throw new BadRequestError(error.message);
        return data as IPackage[];
    }

    async getById(params: { userId: string; packageId: string }): Promise<IPackage> {
        const { userId, packageId } = params;
        const { data, error } = await this.db
            .from('packages')
            .select('*')
            .eq('id', packageId)
            .eq('user_id', userId)
            .single();
        if (error || !data) throw new NotFoundError(`Package with ID ${packageId} not found for user ${userId}`);
        return data as IPackage;
    }

    /**
     * Generate a package quote from destination and POIs using price lookups
     */
    async generate(params: IGeneratePackageParams): Promise<IPackageQuote> {
        const { userId, destinationId, poiIds, currency = 'INR', name, description } = params;

        // Validate destination exists
        const { data: dest, error: destErr } = await this.db.from('destinations').select('id, name').eq('id', destinationId).single();
        if (destErr) throw new BadRequestError(destErr.message);

        // Validate POIs belong to destination
        const { data: pois, error: poisErr } = await this.db.from('pois').select('id, name').in('id', poiIds).eq('destination_id', destinationId);
        if (poisErr) throw new BadRequestError(poisErr.message);
        if (!pois || pois.length !== poiIds.length) throw new BadRequestError('One or more POIs are invalid for the destination');

        // Fetch base price for destination
        const basePrice = await this.lookupEntityPrice({ entityType: 'destination', entityId: destinationId });

        // Fetch POI prices
        const poiPriceItems = await Promise.all(
            poiIds.map(async (poiId) => {
                const unitPrice = await this.lookupEntityPrice({ entityType: 'poi', entityId: poiId });
                const poiName = pois.find((p) => p.id === poiId)?.name;
                return { entity_type: 'poi' as const, entity_id: poiId, name: poiName, unit_price: unitPrice, quantity: 1, total: unitPrice };
            })
        );

        const items: IPackageBreakdown['items'] = [
            { entity_type: 'destination', entity_id: destinationId, name: dest.name, unit_price: basePrice, quantity: 1, total: basePrice },
            ...poiPriceItems,
        ];

        const base_price = basePrice;
        const poi_price_total = poiPriceItems.reduce((sum, i) => sum + i.total, 0);
        const total_price = base_price + poi_price_total;

        const breakdown: IPackageBreakdown = { currency, items, base_price, poi_price_total, total_price };

        return { destination_id: destinationId, poi_ids: poiIds, currency, name, description, breakdown };
    }

    /**
     * Persist a package under the user's account
     */
    async create(params: IPackage): Promise<IPackage> {
        const { user_id, destination_id, name, description, poi_ids, breakdown, currency, is_active = true, priority } = params;

        const { data, error } = await this.db
            .from('packages')
            .insert([
                {
                    user_id,
                    destination_id,
                    name,
                    description,
                    poi_ids,
                    breakdown,
                    currency,
                    is_active,
                    priority,
                },
            ])
            .select('*')
            .single();
        if (error || !data) throw new BadRequestError(error!.message);
        return data as IPackage;
    }

    async update(params: { userId: string; packageId: string; update: Partial<IPackage> }): Promise<IPackage> {
        const { userId, packageId, update } = params;
        await this.getById({ userId, packageId });
        const { data, error } = await this.db.from('packages').update(update).eq('id', packageId).eq('user_id', userId).select('*').single();
        if (error) throw new BadRequestError(error.message);
        return data as IPackage;
    }

    async delete(params: { userId: string; packageId: string }): Promise<{ success: boolean }> {
        const { userId, packageId } = params;
        await this.getById({ userId, packageId });
        const { error } = await this.db.from('packages').delete().eq('id', packageId).eq('user_id', userId);
        if (error) throw new BadRequestError(error.message);
        return { success: true };
    }

    private async lookupEntityPrice(params: { entityType: 'destination' | 'poi'; entityId: string }): Promise<number> {
        const { entityType, entityId } = params;
        const { data, error } = await this.db
            .from('prices')
            .select('price')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .order('effective_from', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (error) throw new BadRequestError(error.message);
        if (!data) return 0;
        return data.price as number;
    }
}


