import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // ✅ adjust based on path
import { Observable } from 'rxjs';
// import { User } from '../../models/user.model'; // or wherever your User model is

export interface User {
    id?: number;
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    status?: string;
    description?: string;
}


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.users;

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`);
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${userId}`);
    }
}
