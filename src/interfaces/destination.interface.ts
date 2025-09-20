import type { Polygon, MultiPolygon, Point } from 'geojson';

/**
 * Lightweight JSON type used for metadata.
 */
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject {
    [k: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {}

/**
 * Raw row as returned by DB (snake_case). `area` / `center` may be a JSON string
 * or a parsed GeoJSON object depending on how you query (use view with ST_AsGeoJSON to guarantee object).
 */
export interface IDBDestinationRow {
    id: string;
    name: string;
    slug: string;
    area: unknown | string; // GeoJSON object or JSON string (depends on query)
    center?: unknown | string; // GeoJSON Point object or JSON string (optional if not selected)
    center_lng?: number;
    center_lat?: number;
    metadata: JSONObject;
    created_at: string; // ISO timestamptz
    updated_at: string;
}

/**
 * Domain model (camelCase). area is normalized to MultiPolygon; center is a simple lat/lng.
 */
export interface IDestination {
    id: string;
    name: string;
    slug: string;
    area: MultiPolygon;
    center: { lat: number; lng: number };
    metadata: JSONObject;
    createdAt: string; // ISO timestamptz
    updatedAt: string;
}

/**
 * DTOs for create/update flows.
 * Accept Polygon or MultiPolygon from client; DB trigger will normalize to MultiPolygon.
 */
export interface ICreateDestination {
    name: string;
    slug: string;
    area: Polygon | MultiPolygon;
    metadata?: JSONObject;
}

export interface IUpdateDestination {
    name?: string;
    slug?: string;
    area?: Polygon | MultiPolygon;
    metadata?: JSONObject;
}
