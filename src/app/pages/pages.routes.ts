import { Routes } from '@angular/router';
import { Documentation } from '../UI/documentation/documentation';
import { Crud } from '../UI/crud/crud';
import { Empty } from '../UI/empty/empty';
import { Users} from './administrator/usersmanagement/users/user';
import { RolePermissions } from './administrator/usersmanagement/rolepermissions/role.permission';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'user', component: Users },
    { path: 'rolepermission', component: RolePermissions },
    //{ path: '', redirectTo: 'user', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
