import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SystemParameter } from '../../../model/administrator/system/SystemParameter';

@Injectable({ providedIn: 'root' })
export class SystemParameterService {
    private apiGSP = environment.apiBase + environment.apiEndpoints.system.systemParameter;

    constructor(private http: HttpClient) {}

    getAllSystemParameter(): Observable<SystemParameter[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<SystemParameter[]>(`${this.apiGSP}`, { headers });
    }

    getSystemParameterById(id: number): Observable<SystemParameter> {
        return this.http.get<SystemParameter>(`${this.apiGSP}/${id}`);
    }

    addSystemParameter(param: SystemParameter): Observable<SystemParameter> {
        return this.http.post<SystemParameter>(this.apiGSP, param);
    }

    updateSystemParameter(param: SystemParameter): Observable<SystemParameter> {
        return this.http.put<SystemParameter>(`${this.apiGSP}/${param.id}`, param);
    }

    deleteSystemParameter(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiGSP}/${id}`);
    }

    searchSystemParameter(keyword: string): Observable<SystemParameter[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
        const url = `${this.apiGSP}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<SystemParameter[]>(url, { headers });
    }
}
