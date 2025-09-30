import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DepartmentModel } from '../../../model/administrator/systemAdmin/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.systemAdmin.department;

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

    getAllDepartment(): Observable<DepartmentModel[]> {
        return this.http.get<DepartmentModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    getDepartmentById(id: number): Observable<DepartmentModel> {
        return this.http.get<DepartmentModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    addDepartment(department: DepartmentModel): Observable<DepartmentModel> {
        return this.http.post<DepartmentModel>(this.apiUrl, department, { headers: this.getAuthHeaders() });
    }

    updateDepartment(department: DepartmentModel): Observable<DepartmentModel> {
        return this.http.put<DepartmentModel>(`${this.apiUrl}/${department.id}`, department, { headers: this.getAuthHeaders() });
    }

    deleteDepartment(departmentId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${departmentId}`, { headers: this.getAuthHeaders() });
    }

    searchDepartment(keyword: string): Observable<DepartmentModel[]> {
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<DepartmentModel[]>(url, { headers: this.getAuthHeaders() });
    }
}
