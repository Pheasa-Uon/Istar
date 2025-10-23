import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { GlobalSystemParameter } from '../../../model/administrator/system/global.system.parameter.model';
import {
    DropdownItemBlacklist,
    DropdownItemLanguage,
    DropdownItemRegion
} from '../../../model/administrator/system/country.model';
import { DropdownItemProvince } from '../../../model/administrator/systemAdmin/branch.model';

@Injectable({ providedIn: 'root' })
export class GlobalSystemParameterService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.globalSystemParameter;

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

    getAllGlobalSystemParameter(): Observable<GlobalSystemParameter[]> {
        return this.http.get<GlobalSystemParameter[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
    }

    getGlobalSystemParameterById(id: number): Observable<GlobalSystemParameter> {
        return this.http.get<GlobalSystemParameter>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    addGlobalSystemParameter(param: GlobalSystemParameter): Observable<GlobalSystemParameter> {
        return this.http.post<GlobalSystemParameter>(this.apiUrl, param);
    }

    updateGlobalSystemParameter(param: GlobalSystemParameter): Observable<GlobalSystemParameter> {
        return this.http.put<GlobalSystemParameter>(`${this.apiUrl}/${param.id}`, param);
    }

    deleteGlobalSystemParameter(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchGlobalSystemParameter(keyword: string): Observable<GlobalSystemParameter[]> {
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<GlobalSystemParameter[]>(url, { headers: this.getAuthHeaders() });
    }

    // Dropdown Item

    getProvinceDropdown(): Observable<DropdownItemProvince[]> {
        return this.http.get<DropdownItemProvince[]>(`${this.apiUrl}/province-dropdown`, { headers: this.getAuthHeaders() });
    }

    getLanguageDropdown(): Observable<DropdownItemLanguage[]> {
        return this.http.get<DropdownItemLanguage[]>(`${this.apiUrl}/language-dropdown`, { headers: this.getAuthHeaders() });
    }

    getRegionDropdown(): Observable<DropdownItemRegion[]> {
        return this.http.get<DropdownItemRegion[]>(`${this.apiUrl}/region-dropdown`, { headers: this.getAuthHeaders() });
    }

    getBlacklistDropdown(): Observable<DropdownItemBlacklist[]> {
        return this.http.get<DropdownItemBlacklist[]>(`${this.apiUrl}/blacklist-dropdown`, { headers: this.getAuthHeaders() });
    }
}
