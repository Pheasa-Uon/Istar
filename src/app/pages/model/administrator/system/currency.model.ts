export interface StringOption {
    value: string;
    label: string;
}

export interface CurrencyModel {
    id?: number | undefined;
    currency_code?: string;
    currency_char?: string;
    currency_number?: string;
    currency_name?: string;
    local_currency_name?: string;
    currency_symbol?: string;
    decimal_digits?: boolean;
    rounding_digits?: boolean;
    display_order?: boolean;
    currency_status?: StringOption;
    description: string;
}

export interface Currency {
    id: number;
    label: string;
}
