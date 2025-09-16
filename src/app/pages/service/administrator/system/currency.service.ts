import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Currency } from '../../../model/Currency';


@Injectable({ providedIn: 'root' })
export class CurrencyService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.currency;

    constructor(private http: HttpClient) {}

    // ✅ Get all roles
    getAllCurrency(): Observable<Currency[]> {
        const token = localStorage.getItem('authToken'); // your login token
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Currency[]>(this.apiUrl, { headers });
    }

    // ✅ Get a single role
    getCurrencyById(id: number): Observable<Currency> {
        return this.http.get<Currency>(`${this.apiUrl}/${id}`);
    }

    // ✅ Create new role
    addCurrency(role: Currency): Observable<Currency> {
        return this.http.post<Currency>(this.apiUrl, role);
    }

    // ✅ Update existing role
    updateCurrency(role: Currency): Observable<Currency> {
        return this.http.put<Currency>(`${this.apiUrl}/${role.id}`, role);
    }

    // ✅ Delete role
    deleteCurrency(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
    }

    searchCurrency(keyword: string): Observable<Currency[]> {
        const token = localStorage.getItem('authToken'); // or wherever you store your token

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });

        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;

        return this.http.get<Currency[]>(url, { headers });
    }
}
