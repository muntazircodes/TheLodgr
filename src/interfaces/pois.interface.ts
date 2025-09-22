export interface IPoiCategory {
    id?: string;
    name: string;
    icon: string;
    description: string;
    created_at?: Date;
}

export interface IPoi {
    id?: string;
    destination_id: string;
    name: string;
    description?: string;
    category_id: string;

    latitude: number;
    longitude: number;
    elevation: number;
    address: Object;
    contact_info?: Object;
    opening_hours?: Object;
    features?: Object;

    images?: Object;
    is_active: boolean;

    min_zoom: number;
    max_zoom: number;
    priority?: number;

    average_rating?: number;
    total_ratings?: number;
}

export interface IPoiRating {
    id?: string;
    poi_id: string;
    user_id: string;
    rating: number;
    review: string;
    images?: any;
    visit_date: string;
}

export interface IPoiWishlist {
    id?: string;
    user_id: string;
    poi_id: string;
}
