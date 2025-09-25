import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CountryModel } from '../../../model/administrator/system/country.model';


@Injectable({ providedIn: 'root' })
export class CountryService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.country;

    constructor(private http: HttpClient) {}

    // ✅ Get all roles
    getAllCountry(): Observable<CountryModel[]> {
        const token = localStorage.getItem('authToken'); // your login token
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<CountryModel[]>(this.apiUrl, { headers });
    }

    // ✅ Get a single role
    getCountryById(id: number): Observable<CountryModel> {
        return this.http.get<CountryModel>(`${this.apiUrl}/${id}`);
    }

    // ✅ Create new role
    addCountry(role: CountryModel): Observable<CountryModel> {
        return this.http.post<CountryModel>(this.apiUrl, role);
    }

    // ✅ Update existing role
    updateCountry(role: CountryModel): Observable<CountryModel> {
        return this.http.put<CountryModel>(`${this.apiUrl}/${role.id}`, role);
    }

    // ✅ Delete role
    deleteCountry(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
    }

    searchCountry(keyword: string): Observable<CountryModel[]> {
        const token = localStorage.getItem('authToken'); // or wherever you store your token

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });

        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;

        return this.http.get<CountryModel[]>(url, { headers });
    }
}
