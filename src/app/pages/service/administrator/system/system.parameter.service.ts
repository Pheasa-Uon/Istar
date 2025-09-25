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
        return this.http.get<SystemParameterModel>(`${this.apiGSP}/${id}`);
    }

    addSystemParameter(param: SystemParameterModel): Observable<SystemParameterModel> {
        return this.http.post<SystemParameterModel>(this.apiGSP, param);
    }

    updateSystemParameter(param: SystemParameterModel): Observable<SystemParameterModel> {
        return this.http.put<SystemParameterModel>(`${this.apiGSP}/${param.id}`, param);
    }

    deleteSystemParameter(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiGSP}/${id}`);
    }

    searchSystemParameter(keyword: string): Observable<SystemParameterModel[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
        const url = `${this.apiGSP}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<SystemParameterModel[]>(url, { headers });
    }
}
