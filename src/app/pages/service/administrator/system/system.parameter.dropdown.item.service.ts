import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';

export interface DropdownItemModuleName {
    code: string;
    name: string;
}

export interface DropdownItemFieldName {
    code: string;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class SPDropdownItemService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.converterName;

    constructor(private http: HttpClient) {}

    getDropDownModuleNames(): Observable<DropdownItemModuleName[]> {
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/module-names`)
            .pipe(map(data => Object.keys(data).map(key => ({ code: key, name: data[key] }))));
    }

    getModuleNames(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/module-names`);
    }

}
