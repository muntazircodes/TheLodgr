/**
 * GUIDE
 */
export interface IGuide {
    id: string;
    name: string;
    phone: string;
    email?: string;
    license_number?: string;
    languages: string[];
    specialties: string[];
    rating: number;
    total_trips: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ICreateGuide {
    name: string;
    phone: string;
    email?: string;
    license_number?: string;
    languages?: string[];
    specialties?: string[];
    is_active?: boolean; // optional, default true
}

export interface IUpdateGuide extends Partial<ICreateGuide> {}

/**
 * GUIDE BOOKING
 */
export interface IGuideBooking {
    id: string;
    guide_id: string;
    user_id: string;
    package_id?: string;
    poi_id?: string;
    start_date: string;
    end_date: string;
    group_size: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface ICreateGuideBooking {
    guide_id: string;
    user_id: string;
    package_id?: string;
    poi_id?: string;
    start_date: string;
    end_date: string;
    group_size: number;
    total_price: number;
    status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface IUpdateGuideBooking extends Partial<ICreateGuideBooking> {}
