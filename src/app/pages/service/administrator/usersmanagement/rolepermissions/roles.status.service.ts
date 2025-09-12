import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolesStatusService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.roles.rolesstatus;
    constructor(private http: HttpClient) {}

    getRolesStatus(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(this.apiUrl);
    }
}
