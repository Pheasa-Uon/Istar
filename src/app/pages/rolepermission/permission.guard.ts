// permission.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PermissionService } from '../service/permission.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleFeaturePermission } from '../model/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
    constructor(private auth: AuthService, private permissionService: PermissionService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const requiredFeature = route.data['featureCode'];
        const requiredPermission = route.data['permission']; // e.g. 'isEdit'

        return this.permissionService.getPermissionsByUser(this.auth.getToken()).pipe(
            map(perms => {
                const perm = perms.find(p => p.featureId === requiredFeature);
                // Add type guard to ensure property exists and is boolean
                return perm ? Boolean(perm[requiredPermission as keyof RoleFeaturePermission]) : false;
            })
        );
    }
}
