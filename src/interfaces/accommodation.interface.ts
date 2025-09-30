export interface IAccommodation {
    id?: string;
    destination_id: string;
    name: string;
    type: string;
    description?: string;
    price_per_night: number;
    capacity?: number;
    amenities?: string[];
    images?: string[];
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ICreateAccommodation {
    destination_id: string;
    name: string;
    type: string;
    description?: string;
    price_per_night: number;
    capacity?: number;
    amenities?: string[];
    images?: string[];
    is_active?: boolean;
}

export interface IUpdateAccommodation {
    name?: string;
    type?: string;
    description?: string;
    price_per_night?: number;
    capacity?: number;
    amenities?: string[];
    images?: string[];
    is_active?: boolean;
}
