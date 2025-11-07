import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
    DropdownItemFieldGlobalSystemParameter,
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

    getVillageDropdown(code: string): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        const params = new HttpParams().set('keyword', code);
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/village`, { params })
            .pipe(map(data => Object.keys(data).map(key => ({ id: Number(key), sysParCode: data[key], valueName: data[key] }))));
    }

    getCommuneDropdown(code: string): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        const params = new HttpParams().set('keyword', code);
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/commune`, { params })
            .pipe(map(data => Object.keys(data).map(key => ({ id: Number(key), sysParCode: data[key], valueName: data[key] }))));
    }

    getDistrictDropdown(code: string): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        const params = new HttpParams().set('keyword', code);
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/district`, { params })
            .pipe(map(data => Object.keys(data).map(key => ({ id: Number(key), sysParCode: data[key], valueName: data[key] }))));
    }

    getWorkingStatusDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/working-status`, { headers: this.getAuthHeaders() });
    }

    getMaritalStatusDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/marital-status`, { headers: this.getAuthHeaders() });
    }

    getPositionDropdown(code: string): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        const params = new HttpParams().set('keyword', code);
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/position`, { params })
            .pipe(map(data => Object.keys(data).map(key => ({ id: Number(key), sysParCode: data[key], valueName: data[key] }))));
    }

    getEmployeeTypeDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/employee_type`, { headers: this.getAuthHeaders() });
    }

    getIssueByDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/issue-by`, { headers: this.getAuthHeaders() });
    }

    getIDTypeDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/identity_type`, { headers: this.getAuthHeaders() });
    }

    getGenderDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/gender`, { headers: this.getAuthHeaders() });
    }

    getProvinceDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/province`, { headers: this.getAuthHeaders() });
    }

    getLanguageDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/language`, { headers: this.getAuthHeaders() });
    }

    getRegionDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/region`, { headers: this.getAuthHeaders() });
    }

    getBlacklistDropdown(): Observable<DropdownItemFieldGlobalSystemParameter[]> {
        return this.http.get<DropdownItemFieldGlobalSystemParameter[]>(`${this.apiUrl}/blacklist`, { headers: this.getAuthHeaders() });
    }
}
