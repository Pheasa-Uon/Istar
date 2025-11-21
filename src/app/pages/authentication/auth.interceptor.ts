import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('authToken');

    const clonedReq = token ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    }) : req;

    return next(clonedReq).pipe(
        catchError(err => {
            if (err.status === 401) {
                localStorage.removeItem('authToken');
                router.navigate(['/login']); // auto-redirect to login
            }
            return throwError(() => err);
        })
    );
};
