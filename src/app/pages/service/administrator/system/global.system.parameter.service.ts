import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface GlobalSystemParameter {
    id?: number;
    sysParCode?: string;
    moduleName?: string;
    fieldName?: string;
    valueName?: string;
    localValueName?: string;
    displayOrder?: boolean;
    sysParStatus?: string;
    description?: string;
}

@Injectable({ providedIn: 'root' })
export class GlobalSystemParameterService {
    private apiGSP = environment.apiBase + environment.apiEndpoints.system.globalSystemParameter;

    constructor(private http: HttpClient) {}

    getAllGlobalSystemParameter(): Observable<GlobalSystemParameter[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<GlobalSystemParameter[]>(`${this.apiGSP}`, { headers });
    }

    getGlobalSystemParameterById(id: number): Observable<GlobalSystemParameter> {
        return this.http.get<GlobalSystemParameter>(`${this.apiGSP}/${id}`);
    }

    addGlobalSystemParameter(param: GlobalSystemParameter): Observable<GlobalSystemParameter> {
        return this.http.post<GlobalSystemParameter>(this.apiGSP, param);
    }

    updateGlobalSystemParameter(param: GlobalSystemParameter): Observable<GlobalSystemParameter> {
        return this.http.put<GlobalSystemParameter>(`${this.apiGSP}/${param.id}`, param);
    }

    deleteGlobalSystemParameter(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiGSP}/${id}`);
    }

    searchGlobalSystemParameter(keyword: string): Observable<GlobalSystemParameter[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
        const url = `${this.apiGSP}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<GlobalSystemParameter[]>(url, { headers });
    }
}
