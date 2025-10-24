export interface LongOption {
    value: number;
    label: string;
}

export interface StringOption {
    value: string;
    label: string;
}

export interface CountryModel {
    id?: number | undefined;
    iso2Alpha?: string;
    iso3Alpha?: string;
    country_name?: string;
    local_country_name?: string;
    currency_id?: LongOption;
    language?: StringOption;
    region?: StringOption;
    blacklist?: StringOption;
    display_order?: number;
    country_status?: StringOption;
    description?: string;
}

// CurrencyModel dropdown model
export interface DropdownItemCurrency {
    id: number;
    label: string;
}
