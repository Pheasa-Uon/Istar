import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
    DropdownItemGlobalSystemParameter,
    GlobalSystemParameter
} from '../../../model/administrator/system/global.system.parameter.model';

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

    getProvinceDropdown(): Observable<DropdownItemGlobalSystemParameter[]> {
        return this.http.get<DropdownItemGlobalSystemParameter[]>(`${this.apiUrl}/province`, { headers: this.getAuthHeaders() });
    }

    getLanguageDropdown(): Observable<DropdownItemGlobalSystemParameter[]> {
        return this.http.get<DropdownItemGlobalSystemParameter[]>(`${this.apiUrl}/language`, { headers: this.getAuthHeaders() });
    }

    getRegionDropdown(): Observable<DropdownItemGlobalSystemParameter[]> {
        return this.http.get<DropdownItemGlobalSystemParameter[]>(`${this.apiUrl}/region`, { headers: this.getAuthHeaders() });
    }

    getBlacklistDropdown(): Observable<DropdownItemGlobalSystemParameter[]> {
        return this.http.get<DropdownItemGlobalSystemParameter[]>(`${this.apiUrl}/blacklist`, { headers: this.getAuthHeaders() });
    }
}
