import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SystemParameterModel } from '../../../model/administrator/system/system.parameter.model';
import { GlobalPolicyModel } from '../../../model/administrator/system/global.policy.model';

@Injectable({ providedIn: 'root' })
export class GlobalPolicyService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.globalPolicy;

    constructor(private http: HttpClient) {}

    getAllGlobalPolicy(): Observable<GlobalPolicyModel[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<GlobalPolicyModel[]>(`${this.apiUrl}`, { headers });
    }

    getGlobalPolicyById(id: number): Observable<GlobalPolicyModel> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<GlobalPolicyModel>(`${this.apiUrl}/${id}`, { headers });
    }

    addGlobalPolicy(param: GlobalPolicyModel): Observable<GlobalPolicyModel> {
        return this.http.post<GlobalPolicyModel>(this.apiUrl, param);
    }

    updateGlobalPolicy(param: GlobalPolicyModel): Observable<GlobalPolicyModel> {
        return this.http.put<GlobalPolicyModel>(`${this.apiUrl}/${param.id}`, param);
    }

    deleteGlobalPolicy(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchGlobalPolicy(keyword: string): Observable<GlobalPolicyModel[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<GlobalPolicyModel[]>(url, { headers });
    }
}
