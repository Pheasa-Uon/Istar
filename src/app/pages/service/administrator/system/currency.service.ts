import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CurrencyModel } from '../../../model/administrator/system/currency.model';


@Injectable({ providedIn: 'root' })
export class CurrencyService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.currency;

    constructor(private http: HttpClient) {}

    // ✅ Get all roles
    getAllCurrency(): Observable<CurrencyModel[]> {
        const token = localStorage.getItem('authToken'); // your login token
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<CurrencyModel[]>(this.apiUrl, { headers });
    }

    // ✅ Get a single role
    getCurrencyById(id: number): Observable<CurrencyModel> {
        return this.http.get<CurrencyModel>(`${this.apiUrl}/${id}`);
    }

    // ✅ Create new role
    addCurrency(role: CurrencyModel): Observable<CurrencyModel> {
        return this.http.post<CurrencyModel>(this.apiUrl, role);
    }

    // ✅ Update existing role
    updateCurrency(role: CurrencyModel): Observable<CurrencyModel> {
        return this.http.put<CurrencyModel>(`${this.apiUrl}/${role.id}`, role);
    }

    // ✅ Delete role
    deleteCurrency(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
    }

    searchCurrency(keyword: string): Observable<CurrencyModel[]> {
        const token = localStorage.getItem('authToken'); // or wherever you store your token

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });

        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;

        return this.http.get<CurrencyModel[]>(url, { headers });
    }
}
