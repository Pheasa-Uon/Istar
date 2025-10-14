import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Login } from './app/pages/authentication/login';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/UI/documentation/documentation';
import { Landing } from './app/UI/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { UsersComponent } from './app/pages/administrator/UsersManagement/Users/user';
import { AddUser } from './app/pages/administrator/UsersManagement/Users/adduser';
import { EditUser } from './app/pages/administrator/UsersManagement/Users/edituser';
import { RolePermissionsComponent } from './app/pages/administrator/UsersManagement/RolePermissions/role.permission';
import { AddRolePermission } from './app/pages/administrator/UsersManagement/RolePermissions/add.role.permission';
import { EditRolePermission } from './app/pages/administrator/UsersManagement/RolePermissions/edit.role.permission';
import { SetRolePermission } from './app/pages/administrator/UsersManagement/RolePermissions/set.role.permission';
import { AuthGuard} from './app/pages/authentication/AuthGuard';
import { GlobalSystemParameterComponent } from './app/pages/administrator/System/GlobalSystemParameter/global.system.parameter';
import { AddGlobalSystemParameter } from './app/pages/administrator/System/GlobalSystemParameter/add.global.system.parameter';
import { EditGlobalSystemParameter } from './app/pages/administrator/System/GlobalSystemParameter/edit.global.system.parameter';
import { CurrencyComponent } from './app/pages/administrator/System/Currency/currency';
import { AddCurrency } from './app/pages/administrator/System/Currency/add.currency';
import { EditCurrency } from './app/pages/administrator/System/Currency/edit.currency';
import { CountryComponent } from './app/pages/administrator/System/Country/country';
import { AddCountry } from './app/pages/administrator/System/Country/add.country';
import { EditCountry } from './app/pages/administrator/System/Country/edit.country';
import { SystemParameterComponent } from './app/pages/administrator/System/SystemParameter/system.parameter';
import { AddSystemParameter } from './app/pages/administrator/System/SystemParameter/add.system.parameter';
import { EditSystemParameter } from './app/pages/administrator/System/SystemParameter/edit.system.parameter';
import { GlobalPolicyComponent } from './app/pages/administrator/System/GlobalPolicy/global.policy';
import { AddGlobalPolicy } from './app/pages/administrator/System/GlobalPolicy/add.global.policy';
import { EditGlobalPolicy } from './app/pages/administrator/System/GlobalPolicy/edit.global.policy';
import { BranchComponent } from './app/pages/administrator/SystemAdmin/Branch/branch';
import { AddBranch } from './app/pages/administrator/SystemAdmin/Branch/add.branch';
import { EditBranch } from './app/pages/administrator/SystemAdmin/Branch/edit.branch';
import { DepartmentComponent } from './app/pages/administrator/SystemAdmin/Department/department';
import { AddDepartment } from './app/pages/administrator/SystemAdmin/Department/add.department';
import { EditDepartment } from './app/pages/administrator/SystemAdmin/Department/edit.department';
import { ExchangeRateComponent } from './app/pages/administrator/SystemAdmin/ExchangeRate/exchange.rate';
import { CalendarComponent } from './app/pages/administrator/SystemAdmin/Calendar/calendar';

export const appRoutes: Routes = [

    // Redirect empty path to login
    { path: '', redirectTo: 'login', pathMatch: 'full' },


    // Login page (outside AppLayout so no main layout)
    { path: 'login', component: Login },

    // Landing page (public)
    { path: 'landing', component: Landing },

    // Routes with main app layout
    {
        path: '',
        component: AppLayout,
        children: [
            // Default route goes to dashboard
            { path: 'dashboard', component: Dashboard , canActivate: [AuthGuard] },

            { path: 'documentation', component: Documentation },

            // User routes
            { path: 'user', component: UsersComponent },
            { path: 'add-user', component: AddUser },
            { path: 'edit-user', component: EditUser },

            // Role permissions routes
            { path: 'role-permission', component: RolePermissionsComponent },
            { path: 'add-role-permission', component: AddRolePermission },
            { path: 'edit-role-permission', component: EditRolePermission },
            { path: 'set-role-permission/:id', component: SetRolePermission },

            // Global System Parameter routes
            { path: 'global-system-parameter', component: GlobalSystemParameterComponent },
            { path: 'add-global-system-parameter', component: AddGlobalSystemParameter },
            { path: 'edit-global-system-parameter', component: EditGlobalSystemParameter },

            // CurrencyModel routes
            { path: 'currency', component: CurrencyComponent },
            { path: 'add-currency', component: AddCurrency },
            { path: 'edit-currency', component: EditCurrency },

            // CountryModel routes
            { path: 'country', component: CountryComponent },
            { path: 'add-country', component: AddCountry },
            { path: 'edit-country', component: EditCountry },

            // System Parameter routes
            { path: 'system-parameter', component: SystemParameterComponent },
            { path: 'add-system-parameter', component: AddSystemParameter },
            { path: 'edit-system-parameter', component: EditSystemParameter },

            // Global Policy routes
            { path: 'global-policy', component: GlobalPolicyComponent },
            { path: 'add-global-policy', component: AddGlobalPolicy },
            { path: 'edit-global-policy', component: EditGlobalPolicy },

            // Branch routes
            { path: 'branch', component: BranchComponent },
            { path: 'add-branch', component: AddBranch },
            { path: 'edit-branch', component: EditBranch },

            // Department routes
            { path: 'department', component: DepartmentComponent },
            { path: 'add-department', component: AddDepartment },
            { path: 'edit-department', component: EditDepartment },

            { path: 'exchange-rate', component: ExchangeRateComponent },
            { path: 'calendar', component: CalendarComponent },

            // Lazy loaded modules - make sure these modules exist and export NgModule classes
            { path: 'uikit', loadChildren: () => import('./app/UI/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },

    // Auth module lazy loaded (optional, depends on your setup)
    { path: 'auth', loadChildren: () => import('./app/pages/authentication/auth.routes') },

    // Not found page
    { path: 'notfound', component: Notfound },

    // Catch-all route redirects to notfound
    { path: '**', redirectTo: '/notfound' }
];
