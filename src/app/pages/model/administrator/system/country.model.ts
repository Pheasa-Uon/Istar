export interface CountryModel {
    id?: number | undefined;
    iso2Alpha?: string;
    iso3Alpha?: string;
    countryName?: string;
    localCountryName?: string;
    currencyId?: undefined;
    language?: string;
    region?: string;
    blacklist?: string;
    displayOrder?: boolean;
    countryStatus?: string;
    description?: string;
}
