import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Users} from './users/user';
//import { AddUser } from './users/adduser';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'user', component: Users },
    //{ path: 'adduser', component: AddUser },
    //{ path: '', redirectTo: 'user', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
