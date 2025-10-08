export interface ExchangeRateRequest {
    version?: number;
    systemDate?: string;    // "YYYY-MM-DD"
    systemDateId: number;
    currencyId: number;
    systemRate: number;
    bidRate?: number;
    askRate?: number;
}

export interface ExchangeRateResponse {
    id: number;
    systemDate?: string;
    systemDateId?: any;
    currency?: any;
    systemRate?: number;
    bidRate?: number;
    askRate?: number;
    createdBy?: number;
    createdAt?: string;
}
