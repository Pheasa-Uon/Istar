import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Users } from './app/pages/users/user';
import { AddUser } from './app/pages/users/adduser';
import { EditUser } from './app/pages/users/edituser';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'user', component: Users },
            { path: 'adduser', component: AddUser },
            { path: 'edituser', component: EditUser },
            { path: '', redirectTo: 'user', pathMatch: 'full' },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }


        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
