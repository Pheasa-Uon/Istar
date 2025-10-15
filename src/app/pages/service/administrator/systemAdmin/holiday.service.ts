import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { HolidayModel } from '../../../model/administrator/systemAdmin/holiday.model';


@Injectable({ providedIn: 'root' })
export class HolidayService {

    private apiUrl = environment.apiBase + environment.apiEndpoints.systemAdmin.holiday;

    constructor(private http: HttpClient) {}

    // 🔹 Helper to build headers
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // ✅ Get all Holiday
    getAllHoliday(): Observable<HolidayModel[]> {
        return this.http.get<HolidayModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    // ✅ Get a single Holiday
    getHolidayById(id: number): Observable<HolidayModel> {
        return this.http.get<HolidayModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Create new Holiday
    addHoliday(holiday: HolidayModel): Observable<HolidayModel> {
        return this.http.post<HolidayModel>(this.apiUrl, holiday, { headers: this.getAuthHeaders() });
    }

    // ✅ Update existing Holiday
    updateHoliday(holiday: HolidayModel): Observable<HolidayModel> {
        return this.http.put<HolidayModel>(`${this.apiUrl}/${holiday.id}`, holiday, { headers: this.getAuthHeaders() });
    }

    // ✅ Delete Holiday
    deleteHoliday(holidayId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${holidayId}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Search Holiday
    searchHoliday(keyword: string): Observable<HolidayModel[]> {
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<HolidayModel[]>(url, { headers: this.getAuthHeaders() });
    }
}
