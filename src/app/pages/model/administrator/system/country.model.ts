export interface BooleanOption {
    value: boolean;
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
    countryName?: string;
    localCountryName?: string;
    currencyId?: BooleanOption;
    language?: StringOption;
    region?: StringOption;
    blacklist?: StringOption;
    displayOrder?: boolean;
    countryStatus?: StringOption;
    description?: string;
}

// CurrencyModel dropdown model
export interface DropdownItemCurrency {
    id: number;
    label: string;
}

// Language dropdown model
export interface DropdownItemLanguage {
    sysParCode: string;
    valueName: string;
}

// Region dropdown model
export interface DropdownItemRegion {
    sysParCode: string;
    valueName: string;
}

// Blacklist dropdown model
export interface DropdownItemBlacklist {
    sysParCode: string;
    valueName: string;
}
