import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { WorkingDayModel } from '../../../model/administrator/systemAdmin/working.day.model';

@Injectable({ providedIn: 'root' })
export class WorkingDayService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.systemAdmin.workingDay;

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

    GetWorkingDays(): Observable<WorkingDayModel[]> {
        return this.http.get<WorkingDayModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    updateWorkingDay(workingDay: WorkingDayModel): Observable<WorkingDayModel> {
        return this.http.put<WorkingDayModel>(`${this.apiUrl}/${workingDay.id}`, workingDay, { headers: this.getAuthHeaders() });
    }

}
