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
export class GspDropdownItemService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.system.converterName;
    private apiUrlGSP = environment.apiBase + environment.apiEndpoints.system.globalSystemParameter;

    constructor(private http: HttpClient) {}

    getGSPStatus(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrlGSP}/status`);
    }

    getModuleFields(moduleCode: string): Observable<DropdownItemFieldName[]> {
        const params = new HttpParams().set('keyword', moduleCode);
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/module-fields`, { params })
            .pipe(map(data => Object.keys(data).map(key => ({ code: key, name: data[key] }))));
    }

    getDropDownModuleNames(): Observable<DropdownItemModuleName[]> {
        return this.http
            .get<{ [key: string]: string }>(`${this.apiUrl}/module-names`)
            .pipe(map(data => Object.keys(data).map(key => ({ code: key, name: data[key] }))));
    }

    getModuleNames(): Observable<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${this.apiUrl}/module-names`);
    }

}
