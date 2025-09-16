import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CurrencyDropdownItemService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.currency;
    constructor(private http: HttpClient) {}

    getCurrencyStatus(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/status`);
    }
}
