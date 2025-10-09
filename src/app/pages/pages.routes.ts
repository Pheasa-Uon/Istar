import { Routes } from '@angular/router';
import { Documentation } from '../UI/documentation/documentation';
import { Crud } from '../UI/crud/crud';
import { Empty } from '../UI/empty/empty';
import { UsersComponent} from './administrator/UsersManagement/Users/user';
import { RolePermissionsComponent } from './administrator/UsersManagement/RolePermissions/role.permission';
import { GlobalSystemParameterComponent } from './administrator/System/GlobalSystemParameter/global.system.parameter';
import { CurrencyComponent } from './administrator/System/Currency/currency';
import { CountryComponent } from './administrator/System/Country/country';
import { SystemParameterComponent } from './administrator/System/SystemParameter/system.parameter';
import { GlobalPolicyComponent } from './administrator/System/GlobalPolicy/global.policy';
import { BranchComponent } from './administrator/SystemAdmin/Branch/branch';
import { DepartmentComponent } from './administrator/SystemAdmin/Department/department';
import { ExchangeRateComponent } from './administrator/SystemAdmin/ExchangeRate/exchange.rate';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'user', component: UsersComponent },
    { path: 'role-permission', component: RolePermissionsComponent },
    { path: 'global-System-parameter', component: GlobalSystemParameterComponent },
    { path: 'currency', component: CurrencyComponent },
    { path: 'country', component: CountryComponent },
    { path: 'system-parameter', component: SystemParameterComponent },
    { path: 'global-policy', component: GlobalPolicyComponent },
    { path: 'branch', component: BranchComponent },
    { path: 'department', component: DepartmentComponent },
    { path: 'exchange-rate', component: ExchangeRateComponent },

    //{ path: '', redirectTo: 'user', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
