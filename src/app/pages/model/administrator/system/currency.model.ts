export interface StringOption {
    value: string;
    label: string;
}

export interface CurrencyModel {
    id?: number | undefined;
    currencyCode?: string;
    currencyChar?: string;
    currencyNumber?: string;
    currencyName?: string;
    localCurrencyName?: string;
    currencySymbol?: string;
    decimalDigits?: boolean;
    roundingDigits?: boolean;
    displayOrder?: boolean;
    currencyStatus?: StringOption;
    description: string;
}

export interface Currency {
    value: number;
    label: string;
}
