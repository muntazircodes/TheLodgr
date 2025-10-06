export interface IDBPackageRow {
    id: string;
    name: string;
    description: string | null;
    duration_days: number | null;
    base_price: number | null;
    user_id: string | null;
    is_custom: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ICreatePackage {
    name: string;
    description?: string;
    duration_days?: number;
    base_price?: number;
    user_id?: string;
    is_custom?: boolean;
    is_active?: boolean;
}

export interface IUpdatePackage {
    name?: string;
    description?: string | null;
    duration_days?: number | null;
    base_price?: number | null;
    user_id?: string | null;
    is_custom?: boolean;
    is_active?: boolean;
}

export type PackageComponentType = 'destination' | 'accommodation' | 'activity' | 'transport' | 'guide' | 'poi';

export interface IDBPackageComponentRow {
    id: string;
    package_id: string;
    component_type: PackageComponentType;
    component_id: string;
    quantity: number;
    price: number;
    meta: Record<string, unknown>;
    created_at: string;
}

export interface ICreatePackageComponent {
    package_id: string;
    component_type: PackageComponentType;
    component_id: string;
    quantity?: number; // default 1
    price: number;
    meta?: Record<string, unknown>;
}

export interface IUpdatePackageComponent {
    component_type?: PackageComponentType;
    component_id?: string;
    quantity?: number;
    price?: number;
    meta?: Record<string, unknown>;
}
