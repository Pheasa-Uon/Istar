import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SystemParameter } from '../../../model/administrator/system/SystemParameter';
import { GlobalPolicy } from '../../../model/administrator/system/GlobalPolicy';

@Injectable({ providedIn: 'root' })
export class GlobalPolicyService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.globalPolicy;

    constructor(private http: HttpClient) {}

    getAllGlobalPolicy(): Observable<GlobalPolicy[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<GlobalPolicy[]>(`${this.apiUrl}`, { headers });
    }

    getGlobalPolicyById(id: number): Observable<GlobalPolicy> {
        return this.http.get<GlobalPolicy>(`${this.apiUrl}/${id}`);
    }

    addGlobalPolicy(param: GlobalPolicy): Observable<GlobalPolicy> {
        return this.http.post<GlobalPolicy>(this.apiUrl, param);
    }

    updateGlobalPolicy(param: GlobalPolicy): Observable<GlobalPolicy> {
        return this.http.put<GlobalPolicy>(`${this.apiUrl}/${param.id}`, param);
    }

    deleteGlobalPolicy(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchGlobalPolicy(keyword: string): Observable<GlobalPolicy[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<GlobalPolicy[]>(url, { headers });
    }
}
