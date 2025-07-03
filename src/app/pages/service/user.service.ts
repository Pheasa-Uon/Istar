import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
    id?: number | undefined;
    username?: string;
    name?: string;
    lastlogindate?: string;
    email?: string;
    status?: string;
    password?: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private users: User[] = [
        { id: 10001, username: 'admin', name: 'Administrator', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'A', password: '12345678', description: 'Admin System' },
        { id: 10002, username: 'dara', name: 'GM Sovandara', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'A', password: '12345678', description: 'User System' },
        { id: 10003, username: 'pheasa', name: 'Pheasa', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'A', password: '12345678', description: 'User System' },
        { id: 10004, username: 'chhunhai', name: 'GM Chhunhai', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'B', password: '12345678', description: 'User System' },
        { id: 10005, username: 'mey', name: 'Srey Mey', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'C', password: '12345678', description: 'User System' },
        { id: 10006, username: 'neth', name: 'Srey Neth', lastlogindate: '01/June/2025', email: 'uonpheasa.up@gmail.com', status: 'C', password: '12345678', description: 'User System' }
    ];

    getUsersMedium(): Promise<User[]> {
        return Promise.resolve(this.users);
    }

    updateUser(user: User): Observable<User> {
        // Simulate HTTP request delay
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = { ...user };
            return of(user).pipe(delay(1000)); // simulate success response after 1s
        } else {
            return throwError(() => new Error('User not found')).pipe(delay(1000));
        }
    }
}
