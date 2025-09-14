import { Routes } from '@angular/router';
import { Documentation } from '../UI/documentation/documentation';
import { Crud } from '../UI/crud/crud';
import { Empty } from '../UI/empty/empty';
import { UsersComponent} from './administrator/usersmanagement/users/user';
import { RolePermissionsComponent } from './administrator/usersmanagement/rolepermissions/role.permission';
import { GlobalSystemParameterComponent } from './administrator/system/globalsystemparameter/global.system.parameter';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'user', component: UsersComponent },
    { path: 'role-permission', component: RolePermissionsComponent },
    { path: 'global-system-parameter', component: GlobalSystemParameterComponent },
    //{ path: '', redirectTo: 'user', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
