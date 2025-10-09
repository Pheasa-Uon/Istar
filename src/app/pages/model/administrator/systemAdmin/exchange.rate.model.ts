// src/app/model/administrator/systemAdmin/exchange.rate.model.ts
import { Currency } from '../system/currency.model';

export interface ExchangeRateRequest {
    system_date_id: number;
    system_date: string;
    currency: number;
    system_rate: number;
    bid_rate?: number;
    ask_rate?: number;
}

export interface ExchangeRateResponse {
    id: number;
    system_date_id: number;
    system_date: string;
    currency: Currency,
    system_rate: number | null;
    bid_rate: number | null;
    ask_rate: number | null;
}
