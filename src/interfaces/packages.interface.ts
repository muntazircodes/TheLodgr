export interface IPackageBreakdown {
    currency: string;
    items: Array<{
        entity_type: 'destination' | 'poi';
        entity_id: string;
        name?: string;
        unit_price: number;
        quantity: number;
        total: number;
    }>;
    base_price?: number;
    poi_price_total?: number;
    total_price: number;
}

export interface IPackage {
    id?: string;
    user_id: string;
    destination_id: string;
    name: string;
    description?: string;
    poi_ids: string[];
    breakdown: IPackageBreakdown;
    currency: string;
    is_active: boolean;
    priority?: number;
    created_at?: string;
    updated_at?: string;
}

export interface IGeneratePackageParams {
    userId: string;
    destinationId: string;
    poiIds: string[];
    currency?: string;
    name?: string;
    description?: string;
}

export interface IPackageQuote {
    destination_id: string;
    poi_ids: string[];
    currency: string;
    name?: string;
    description?: string;
    breakdown: IPackageBreakdown;
}


