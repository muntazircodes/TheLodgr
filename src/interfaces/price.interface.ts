import { EntityType, PriceTier } from '../enums/price-enum';

export interface IPrice {
    id?: string;
    entity_type: EntityType;
    entity_id: string;
    price: number;
    tier?: PriceTier;
    effective_from: Date;
    effective_to?: Date;
}
