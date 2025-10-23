import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
    CountryModel,
    DropdownItemBlacklist,
    DropdownItemLanguage,
    DropdownItemRegion
} from '../../../model/administrator/system/country.model';

@Injectable({ providedIn: 'root' })
export class CountryService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.country;

    constructor(private http: HttpClient) {}

    // 🔹 Helper to build headers
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // ✅ Get all country
    getAllCountry(): Observable<CountryModel[]> {
        return this.http.get<CountryModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    // ✅ Get a single country
    getCountryById(id: number): Observable<CountryModel> {
        return this.http.get<CountryModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Create new country
    addCountry(country: CountryModel): Observable<CountryModel> {
        return this.http.post<CountryModel>(this.apiUrl, country, { headers: this.getAuthHeaders() });
    }

    // ✅ Update existing country
    updateCountry(country: CountryModel): Observable<CountryModel> {
        return this.http.put<CountryModel>(`${this.apiUrl}/${country.id}`, country, { headers: this.getAuthHeaders() });
    }

    // ✅ Delete country
    deleteCountry(countryId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${countryId}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Search country
    searchCountry(keyword: string): Observable<CountryModel[]> {
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<CountryModel[]>(url, { headers: this.getAuthHeaders() });
    }
}
