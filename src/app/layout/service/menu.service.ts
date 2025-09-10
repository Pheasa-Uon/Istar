// src/app/services/menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface MenuPermissionDTO {
    code: string;
    label: string;
    route: string;
    icon?: string;
    visible: boolean;
    children?: MenuPermissionDTO[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.permission;

    constructor(private http: HttpClient) {}

    getMyMenuPermissions(): Observable<MenuPermissionDTO[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.get<MenuPermissionDTO[]>(`${this.apiUrl}/menus/me`, { headers });
    }


}
