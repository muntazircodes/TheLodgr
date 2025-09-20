import { BadRequestError, NotFoundError, UnauthorizedError } from '@hyperflake/http-errors';
import { SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios';
import { getDB } from '../configuration/database.config';
import { ICreateWeatherRequest } from '../interfaces/weather.interface';
import { WeatherMapper } from '../utils/weather.mapper';

export class WeatherService {
    private readonly baseUrl = 'https://api.tomorrow.io/v4/weather/forecast';
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.TOMORROW_API_KEY as string;
        if (!this.apiKey) {
            throw new UnauthorizedError('Tomorrow.io API key is missing in environment variables.');
        }
    }

    private get db(): SupabaseClient {
        return getDB();
    }

    /**
     * @desc Fetch forecast (hourly + daily) from Tomorrow.io
     */
    private async fetchFromProvider(lat: number, lon: number) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    location: `${lat},${lon}`,
                    timesteps: ['1h', '1d'],
                    units: 'metric',
                    apikey: this.apiKey,
                },
            });

            const timelines = response.data?.timelines;
            if (!timelines) {
                throw new BadRequestError('Invalid response format from Tomorrow.io API');
            }

            const hourlyData = Array.isArray(timelines.hourly) ? timelines.hourly : [];
            const dailyData = Array.isArray(timelines.daily) ? timelines.daily : [];

            return {
                hourly: WeatherMapper.mapHourly(hourlyData),
                daily: WeatherMapper.mapDaily(dailyData),
            };
        } catch (error: any) {
            if (error.response) {
                throw new BadRequestError(
                    `Tomorrow.io API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
                );
            }
            throw new BadRequestError(`Failed to fetch weather forecast: ${error.message}`);
        }
    }

    /**
     * @desc Fetch weather for a destination and upsert into DB
     */
    async fetchAndStoreForDestination(destinationId: string, isFinal: boolean = false): Promise<void> {
        // Get destination coordinates
        const { data: dest, error: destErr } = await this.db
            .from('destinations')
            .select('id, center_lat, center_lng')
            .eq('id', destinationId)
            .maybeSingle();

        if (destErr) throw new BadRequestError(destErr.message);
        if (!dest) throw new NotFoundError(`Destination not found: ${destinationId}`);

        const lat = dest.center_lat as number;
        const lon = dest.center_lng as number;

        if (typeof lat !== 'number' || typeof lon !== 'number') {
            throw new BadRequestError(`Invalid coordinates for destination ${destinationId}`);
        }

        // Fetch data from provider
        const forecast = await this.fetchFromProvider(lat, lon);

        // Upsert snapshot
        await this.upsertSnapshot({
            destination_id: destinationId,
            date: new Date().toISOString().split('T')[0],
            hourly: forecast.hourly,
            daily: forecast.daily,
            is_final: isFinal,
        });
    }

    /**
     * @desc Get latest stored forecast for a destination (always DB, no API call)
     */
    async getStoredForecast(destinationId: string) {
        const { data: snapshot, error } = await this.db
            .from('weather_snapshots')
            .select('destination_id, snapshot_date, mapped, is_final, created_at, updated_at')
            .eq('destination_id', destinationId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!snapshot) throw new NotFoundError(`No weather snapshot found for destination: ${destinationId}`);

        return {
            destination_id: snapshot.destination_id,
            snapshot_date: snapshot.snapshot_date,
            mapped: snapshot.mapped,
            is_final: snapshot.is_final,
            created_at: snapshot.created_at,
            updated_at: snapshot.updated_at,
        };
    }

    /**
     * @desc Get stored forecast for a destination by specific date
     */
    async getStoredForecastByDate(destinationId: string, date: string) {
        const { data: snapshot, error } = await this.db
            .from('weather_snapshots')
            .select('destination_id, snapshot_date, mapped, is_final, created_at, updated_at')
            .eq('destination_id', destinationId)
            .eq('snapshot_date', date)
            .order('is_final', { ascending: false }) // Prefer final snapshots
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw new BadRequestError(error.message);
        if (!snapshot)
            throw new NotFoundError(`No weather snapshot found for destination ${destinationId} on date ${date}`);

        return {
            destination_id: snapshot.destination_id,
            snapshot_date: snapshot.snapshot_date,
            mapped: snapshot.mapped,
            is_final: snapshot.is_final,
            created_at: snapshot.created_at,
            updated_at: snapshot.updated_at,
        };
    }

    /**
     * @desc Save or update weather snapshot in DB
     */
    private async upsertSnapshot(payload: ICreateWeatherRequest): Promise<void> {
        try {
            const { error } = await this.db.from('weather_snapshots').upsert(
                {
                    destination_id: payload.destination_id,
                    snapshot_date: payload.date,
                    mapped: {
                        hourly: payload.hourly,
                        daily: payload.daily,
                    },
                    is_final: payload.is_final ?? false,
                },
                {
                    onConflict: 'destination_id,snapshot_date,is_final',
                }
            );

            if (error) {
                throw new BadRequestError(`DB upsert error: ${error.message}`);
            }
        } catch (err: any) {
            throw new BadRequestError(`Failed to save weather snapshot: ${err.message}`);
        }
    }
}
