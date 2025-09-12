import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersStatusService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.users.userstatuses;
    constructor(private http: HttpClient) {}

    getUserStatus(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(this.apiUrl);
    }
}
