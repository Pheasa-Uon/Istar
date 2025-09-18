import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Country } from '../../../model/administrator/system/Country';


@Injectable({ providedIn: 'root' })
export class CountryService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.country;

    constructor(private http: HttpClient) {}

    // ✅ Get all roles
    getAllCountry(): Observable<Country[]> {
        const token = localStorage.getItem('authToken'); // your login token
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Country[]>(this.apiUrl, { headers });
    }

    // ✅ Get a single role
    getCountryById(id: number): Observable<Country> {
        return this.http.get<Country>(`${this.apiUrl}/${id}`);
    }

    // ✅ Create new role
    addCountry(role: Country): Observable<Country> {
        return this.http.post<Country>(this.apiUrl, role);
    }

    // ✅ Update existing role
    updateCountry(role: Country): Observable<Country> {
        return this.http.put<Country>(`${this.apiUrl}/${role.id}`, role);
    }

    // ✅ Delete role
    deleteCountry(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
    }

    searchCountry(keyword: string): Observable<Country[]> {
        const token = localStorage.getItem('authToken'); // or wherever you store your token

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });

        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;

        return this.http.get<Country[]>(url, { headers });
    }
}
