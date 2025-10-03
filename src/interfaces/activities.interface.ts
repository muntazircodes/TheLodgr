export interface IActivityCategory {
    id?: string;
    name: string;
    description?: string;
    icon?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IActivity {
    id?: string;
    destination_id: string;
    poi_id?: string | null;
    category_id?: string | null;
    name: string;
    description?: string;
    image_url?: string;
    duration_minutes?: number;
    capacity?: number;
    difficulty?: string;
    requirements?: string;
    base_price: number;
    price_type: 'per_person' | 'per_group';
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface IActivityBooking {
    id?: string;
    activity_id: string;
    user_id: string;
    package_id?: string | null;
    booking_date: Date | string;
    participants: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at?: Date;
    updated_at?: Date;
}
