import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
    DropdownItemIdGlobalSystemParameter,
    DropdownItemSysParCodeGlobalSystemParameter,
    GlobalSystemParameter
} from '../../../model/administrator/system/global.system.parameter.model';
import { map } from 'rxjs/operators';

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

    getPositionDropdown(code: string): Observable<DropdownItemIdGlobalSystemParameter[]> {
        const params = new HttpParams().set('keyword', code);
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/position`, { params })
            .pipe(map(data => Object.keys(data).map(key => ({ id: Number(key), valueName: data[key] }))));
    }

    getEmployeeTypeDropdown(): Observable<DropdownItemSysParCodeGlobalSystemParameter[]> {
        return this.http.get<DropdownItemSysParCodeGlobalSystemParameter[]>(`${this.apiUrl}/employee_type`, { headers: this.getAuthHeaders() });
    }

    getIssueByDropdown(): Observable<DropdownItemIdGlobalSystemParameter[]> {
        return this.http.get<DropdownItemIdGlobalSystemParameter[]>(`${this.apiUrl}/issue-by`, { headers: this.getAuthHeaders() });
    }

    getIDTypeDropdown(): Observable<DropdownItemSysParCodeGlobalSystemParameter[]> {
        return this.http.get<DropdownItemSysParCodeGlobalSystemParameter[]>(`${this.apiUrl}/identity_type`, { headers: this.getAuthHeaders() });
    }

    getGenderDropdown(): Observable<DropdownItemSysParCodeGlobalSystemParameter[]> {
        return this.http.get<DropdownItemSysParCodeGlobalSystemParameter[]>(`${this.apiUrl}/gender`, { headers: this.getAuthHeaders() });
    }

    getProvinceDropdown(): Observable<DropdownItemSysParCodeGlobalSystemParameter[]> {
        return this.http.get<DropdownItemSysParCodeGlobalSystemParameter[]>(`${this.apiUrl}/province`, { headers: this.getAuthHeaders() });
    }

    getLanguageDropdown(): Observable<DropdownItemSysParCodeGlobalSystemParameter[]> {
        return this.http.get<DropdownItemSysParCodeGlobalSystemParameter[]>(`${this.apiUrl}/language`, { headers: this.getAuthHeaders() });
    }

    getRegionDropdown(): Observable<DropdownItemSysParCodeGlobalSystemParameter[]> {
        return this.http.get<DropdownItemSysParCodeGlobalSystemParameter[]>(`${this.apiUrl}/region`, { headers: this.getAuthHeaders() });
    }

    getBlacklistDropdown(): Observable<DropdownItemSysParCodeGlobalSystemParameter[]> {
        return this.http.get<DropdownItemSysParCodeGlobalSystemParameter[]>(`${this.apiUrl}/blacklist`, { headers: this.getAuthHeaders() });
    }
}
