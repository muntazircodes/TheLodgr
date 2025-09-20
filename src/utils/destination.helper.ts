import { MultiPolygon, Point, Polygon } from 'geojson';
import { IDBDestinationRow, IDestination } from '../interfaces/destination.interface';

/**
 * Normalize a Polygon -> MultiPolygon. Throws on unsupported geometry types.
 */
export function normalizeToMultiPolygon(g: Polygon | MultiPolygon): MultiPolygon {
    if (g.type === 'MultiPolygon') return g;
    if (g.type === 'Polygon') return { type: 'MultiPolygon', coordinates: [g.coordinates] };
    throw new Error('Unsupported geometry type — expected Polygon or MultiPolygon');
}

/**
 * Map a DB row (snake_case) into the domain model.
 * - Accepts `area` and `center` as either strings or parsed GeoJSON objects.
 * - Prefers center_lat/center_lng if present.
 */
export function mapDbRowToDestination(row: IDBDestinationRow): IDestination {
    // parse area
    const rawArea = typeof row.area === 'string' ? JSON.parse(row.area) : row.area;
    if (!rawArea || (rawArea as any).type === undefined) {
        throw new Error('DB row missing or invalid `area` field');
    }
    // normalize to MultiPolygon
    const area = normalizeToMultiPolygon(rawArea as Polygon | MultiPolygon);

    // center resolution: prefer numeric columns if present (more reliable)
    let lat = row.center_lat;
    let lng = row.center_lng;

    if (lat === undefined || lng === undefined) {
        const rawCenter = typeof row.center === 'string' ? JSON.parse(String(row.center)) : row.center;
        if (!rawCenter || !Array.isArray((rawCenter as Point).coordinates)) {
            throw new Error('DB row missing `center` coordinates');
        }
        const coords = (rawCenter as Point).coordinates;
        lng = coords[0];
        lat = coords[1];
    }

    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        area,
        center: { lat, lng },
        metadata: row.metadata ?? {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
