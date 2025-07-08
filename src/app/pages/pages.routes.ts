import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Users} from './users/user';
import { RolePermissions } from './rolepermission/role.permission';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'user', component: Users },
    { path: 'rolepermission', component: RolePermissions },
    //{ path: '', redirectTo: 'user', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
