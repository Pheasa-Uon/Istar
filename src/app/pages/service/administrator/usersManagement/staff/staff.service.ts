import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import {
    DropdownItemStaff,
    StaffModel
} from '../../../../model/administrator/userManagement/staff.model';


@Injectable({ providedIn: 'root' })
export class StaffService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.usersManagement.staff;

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

    // ✅ Get all staff
    getAllStaff(): Observable<StaffModel[]> {
        return this.http.get<StaffModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    // ✅ Get a single staff
    getStaffById(id: number): Observable<StaffModel> {
        return this.http.get<StaffModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Create new staff
    addStaff(staff: StaffModel): Observable<StaffModel> {
        return this.http.post<StaffModel>(this.apiUrl, staff, { headers: this.getAuthHeaders() });
    }

    // ✅ Update existing staff
    updateStaff(staff: StaffModel): Observable<StaffModel> {
        return this.http.put<StaffModel>(`${this.apiUrl}/${staff.id}`, staff, { headers: this.getAuthHeaders() });
    }

    // ✅ Delete staff
    deleteStaff(staffId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${staffId}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Search staff
    searchStaff(keyword: string): Observable<StaffModel[]> {
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<StaffModel[]>(url, { headers: this.getAuthHeaders() });
    }

    // ✅ Dropdowns
    getStaffDropdown(): Observable<DropdownItemStaff[]> {
        return this.http.get<DropdownItemStaff[]>(`${this.apiUrl}/staff-dropdown`, { headers: this.getAuthHeaders() });
    }
}
