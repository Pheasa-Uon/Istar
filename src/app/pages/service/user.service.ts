import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
    id?: number;
    username?: string;
    name?: string;
    lastlogindate?: string;
    email?: string;
    status?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor() {}

    private getData(): User[] {
        return [
            { id: 10001, username: 'admin', name: 'Administrator', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'active' },
            { id: 10002, username: 'dara', name: 'GM Sovandara', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'active' },
            { id: 10003, username: 'pheasa', name: 'Pheasa', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'active' },
            { id: 10004, username: 'chhunhai', name: 'GM Chhunhai', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'active' },
            { id: 10005, username: 'mey', name: 'Srey Mey', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'active' },
            { id: 10006, username: 'neth', name: 'Srey Neth', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'active' }
        ];
    }

    getUsersMedium(): Promise<User[]> {
        return Promise.resolve(this.getData());
    }

    getUsersMini(): Promise<User[]> {
        return Promise.resolve(this.getData().slice(0, 5));
    }

    getUsersSmall(): Promise<User[]> {
        return Promise.resolve(this.getData().slice(0, 10));
    }

    getUsersLarge(): Promise<User[]> {
        return Promise.resolve(this.getData().slice(0, 200));
    }

    getUsersXLarge(): Promise<User[]> {
        return Promise.resolve(this.getData());
    }
}
