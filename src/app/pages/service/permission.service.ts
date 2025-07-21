import { Injectable } from '@angular/core';

export interface FeaturePermission {
    featureKey: string;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    isSearch?: boolean;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private permissions: FeaturePermission[] = [];

    constructor() {
        const stored = localStorage.getItem('permissions');
        this.permissions = stored ? JSON.parse(stored) : [];
    }

    setPermissions(permissions: FeaturePermission[]): void {
        this.permissions = permissions;
        localStorage.setItem('permissions', JSON.stringify(permissions));
    }

    getPermissions(): FeaturePermission[] {
        return this.permissions;
    }

    hasPermission(featureKey: string, action: 'isAdd' |'isView' | 'isEdit' | 'isDelete' | 'isSearch'): boolean {
        const feature = this.permissions.find(f => f.featureKey === featureKey);
        return feature ? !!feature[action] : true;
    }

    clearPermissions(): void {
        this.permissions = [];
        localStorage.removeItem('permissions');
    }
}
