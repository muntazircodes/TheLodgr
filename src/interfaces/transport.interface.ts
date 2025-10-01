/**
 * VEHICLE
 */
export interface ITransportVehicle {
    id: string;
    name: string;
    type: string; // car, bus, bike, etc.
    brand: string;
    model: string;
    license_plate: string;
    capacity: number;
    features: string[]; // e.g., ["AC", "Wi-Fi"] - stored as JSONB in DB
    image_url?: string;
    base_price: number;
    price_per_km?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * DRIVER
 */
export interface ITransportDriver {
    id: string;
    name: string;
    phone: string;
    license_number: string;
    languages: string[]; // e.g., ["English", "Hindi"]
    rating: number;
    total_trips: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * BOOKING
 */
export interface ITransportBooking {
    id: string;
    vehicle_id: string;
    user_id: string;
    package_id?: string; // nullable
    driver_id?: string; // nullable
    start_date: string; // ISO date
    end_date: string; // ISO date
    pickup_location: {
        lat: number;
        lng: number;
        address?: string;
    };
    drop_location: {
        lat: number;
        lng: number;
        address?: string;
    };
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

/**
 * CREATE / UPDATE DTOs
 */
export interface ICreateTransportVehicle {
    name: string;
    type: string;
    brand: string;
    model: string;
    license_plate: string;
    capacity: number;
    features?: string[];
    image_url?: string;
    base_price: number;
    price_per_km?: number;
}

export interface IUpdateTransportVehicle extends Partial<ICreateTransportVehicle> {}

export interface ICreateTransportDriver {
    name: string;
    phone: string;
    license_number: string;
    languages?: string[];
}

export interface IUpdateTransportDriver extends Partial<ICreateTransportDriver> {}

export interface ICreateTransportBooking {
    vehicle_id: string;
    user_id: string;
    package_id?: string;
    driver_id?: string;
    start_date: string;
    end_date: string;
    pickup_location: {
        lat: number;
        lng: number;
        address?: string;
    };
    drop_location: {
        lat: number;
        lng: number;
        address?: string;
    };
    total_price: number;
    status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface IUpdateTransportBooking extends Partial<ICreateTransportBooking> {}
