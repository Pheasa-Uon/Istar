import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemDateModel } from '../../pages/model/system.date.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SystemDateService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.systemDate;

    constructor(private http: HttpClient) {
    }

    // 🔹 Helper to build headers
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // ✅ Get all country
    getSystemDateIsActive(): Observable<SystemDateModel[]> {
        return this.http.get<SystemDateModel[]>(`${this.apiUrl}/active`, { headers: this.getAuthHeaders() });
    }

    // ✅ Get a single country
    getSystemDateById(id: number): Observable<SystemDateModel> {
        return this.http.get<SystemDateModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }
}
