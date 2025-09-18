import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// Currency dropdown model
export interface DropdownItemCurrency {
    id: number;
    code: string;
    name: string;
    symbol: string;
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

@Injectable({ providedIn: 'root' })
export class CountryDropdownItemService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.country;

    constructor(private http: HttpClient) {}

    getCountryStatus(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/status`);
    }

    getLanguageName(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/languages`);
    }

    getCurrencyName(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/currency`);
    }

    getRegionName(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/regions`);
    }

    getBlacklistName(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/blacklist`);
    }

    getCurrencyDropdown(): Observable<DropdownItemCurrency[]> {
        return this.http.get<DropdownItemCurrency[]>(`${this.apiUrl}/currency-dropdown`);
    }

    getLanguageDropdown(): Observable<DropdownItemLanguage[]> {
        return this.http.get<DropdownItemLanguage[]>(`${this.apiUrl}/language-dropdown`);
    }

    getRegionDropdown(): Observable<DropdownItemRegion[]> {
        return this.http.get<DropdownItemRegion[]>(`${this.apiUrl}/region-dropdown`);
    }

    getBlacklistDropdown(): Observable<DropdownItemBlacklist[]> {
        return this.http.get<DropdownItemBlacklist[]>(`${this.apiUrl}/blacklist-dropdown`);
    }
}
