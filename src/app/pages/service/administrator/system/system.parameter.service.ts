import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SystemParameterModel } from '../../../model/administrator/system/system.parameter.model';

@Injectable({ providedIn: 'root' })
export class SystemParameterService {
    private apiGSP = environment.apiBase + environment.apiEndpoints.system.systemParameter;

    constructor(private http: HttpClient) {}

    getAllSystemParameter(): Observable<SystemParameterModel[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<SystemParameterModel[]>(`${this.apiGSP}`, { headers });
    }

    getSystemParameterById(id: number): Observable<SystemParameterModel> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<SystemParameterModel>(`${this.apiGSP}/${id}`, { headers });
    }

    addSystemParameter(param: SystemParameterModel): Observable<SystemParameterModel> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<SystemParameterModel>(this.apiGSP, param, { headers });
    }

    updateSystemParameter(param: SystemParameterModel): Observable<SystemParameterModel> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put<SystemParameterModel>(`${this.apiGSP}/${param.id}`, param, { headers });
    }

    deleteSystemParameter(id: number): Observable<void> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete<void>(`${this.apiGSP}/${id}`, { headers });
    }

    searchSystemParameter(keyword: string): Observable<SystemParameterModel[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
        const url = `${this.apiGSP}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<SystemParameterModel[]>(url, { headers });
    }
}
