import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface RolePermission {
    id?: number | undefined;
    name?: string;
    status?: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
    private rolePermissions: RolePermission[] = [
        { id: 10001, name: 'Administrator', status: 'A', description: 'Admin System' },
        { id: 10002, name: 'Teller', status: 'A', description: 'Admin System' },
        { id: 10003, name: 'IT', status: 'A', description: 'Admin System' },
        { id: 10004, name: 'Accountant', status: 'A', description: 'Admin System' },
        { id: 10005, name: 'Chief of Financial Officer', status: 'A', description: 'Admin System' },
        { id: 10006, name: 'Chief of Operating Officer', status: 'A', description: 'Admin System' },
        { id: 10007, name: 'Deputy Chief Executive Officer', status: 'A', description: 'Admin System' },
        { id: 10008, name: 'Only view report', status: 'A', description: 'Admin System' },
        { id: 10009, name: 'Board Of Directors', status: 'A', description: 'Admin System' },
    ];

    getRolePermissionMedium(): Promise<RolePermission[]> {
        return Promise.resolve(this.rolePermissions);
    }

    getRolePermission(): Observable<RolePermission[]> {
        return of(this.rolePermissions).pipe(delay(300));
    }

    updateRolePermission(updatedRole: RolePermission): Observable<any> {
        const index = this.rolePermissions.findIndex(u => u.id === updatedRole.id);
        if (index > -1) {
            this.rolePermissions[index] = { ...updatedRole };
            return of({ success: true }).pipe(delay(500));
        } else {
            return throwError(() => new Error('Role Permission not found')).pipe(delay(500));
        }
    }



    addRolePermission(user: RolePermission): Observable<any> {
    //     // In real API, replace this with HTTP POST
    //     //console.log('New user to add:', user);
        return of(user); // simulate success response
    }


    deleteRole(userId: number): Observable<any> {
        const index = this.rolePermissions.findIndex(u => u.id === userId);
        if (index > -1) {
            this.rolePermissions.splice(index, 1);
            return of({ success: true }).pipe(delay(300)); // simulate delay
        } else {
            return throwError(() => new Error('User not found')).pipe(delay(300));
        }
    }

    // saveRolePermissions(payload: { roleId: number | undefined, permissionKeys: string[] }) {
    //     // Replace with actual API call
    //     return this.http.post('/api/role-permission/save', payload);
    // }

    saveRolePermissions(payload: any) {
        console.log('Mock save permissions:', payload);
        return {
            subscribe: ({ next }: { next: () => void }) => {
                setTimeout(() => next(), 500);
            }
        };
    }
}
