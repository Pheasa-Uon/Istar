import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
    ExchangeRateRequest,
    ExchangeRateResponse
} from '../../../model/administrator/systemAdmin/exchange.rate.model';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.systemAdmin.exchangeRate;

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

    GetExchangeRate(): Observable<ExchangeRateResponse[]> {
        return this.http.get<ExchangeRateResponse[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    CreateExchangeRateBulk(data: ExchangeRateRequest[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/bulk`, data, { headers: this.getAuthHeaders() });
    }
}
