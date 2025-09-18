import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Login } from './app/pages/authentication/login';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/UI/documentation/documentation';
import { Landing } from './app/UI/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { UsersComponent } from './app/pages/administrator/usersmanagement/users/user';
import { AddUser } from './app/pages/administrator/usersmanagement/users/adduser';
import { EditUser } from './app/pages/administrator/usersmanagement/users/edituser';
import { RolePermissionsComponent } from './app/pages/administrator/usersmanagement/rolepermissions/role.permission';
import { AddRolePermission } from './app/pages/administrator/usersmanagement/rolepermissions/add.role.permission';
import { EditRolePermission } from './app/pages/administrator/usersmanagement/rolepermissions/edit.role.permission';
import { SetRolePermission } from './app/pages/administrator/usersmanagement/rolepermissions/set.role.permission';
import { AuthGuard} from './app/pages/authentication/AuthGuard';
import { GlobalSystemParameterComponent } from './app/pages/administrator/system/globalsystemparameter/global.system.parameter';
import { AddGlobalSystemParameter } from './app/pages/administrator/system/globalsystemparameter/add.global.system.parameter';
import { EditGlobalSystemParameter } from './app/pages/administrator/system/globalsystemparameter/edit.global.system.parameter';
import { CurrencyComponent } from './app/pages/administrator/system/currency/currency';
import { AddCurrency } from './app/pages/administrator/system/currency/add.currency';
import { EditCurrency } from './app/pages/administrator/system/currency/edit.currency';
import { CountryComponent } from './app/pages/administrator/system/country/country';
import { AddCountry } from './app/pages/administrator/system/country/add.country';
import { EditCountry } from './app/pages/administrator/system/country/edit.country';

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

            // Currency routes
            { path: 'currency', component: CurrencyComponent },
            { path: 'add-currency', component: AddCurrency },
            { path: 'edit-currency', component: EditCurrency },

            // Country routes
            { path: 'country', component: CountryComponent },
            { path: 'add-country', component: AddCountry },
            { path: 'edit-country', component: EditCountry },

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
