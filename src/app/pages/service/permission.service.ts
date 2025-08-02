import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserFeaturePermission {
    code: string;
    isSearch: boolean;
    isAdd: boolean;
    isViewed: boolean;
    isEdit: boolean;
    isApprove: boolean;
    isReject: boolean;
    isDeleted: boolean;
    isSave: boolean;
    isClear: boolean;
    isCancel: boolean;
    isProcess: boolean;
    isImport: boolean;
    isExport: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    constructor(private http: HttpClient) {}

    getPermissionsByUser(userId: number): Observable<UserFeaturePermission[]> {
        return this.http.get<UserFeaturePermission[]>(`/api/user-permissions/me/${userId}`);
    }
}
