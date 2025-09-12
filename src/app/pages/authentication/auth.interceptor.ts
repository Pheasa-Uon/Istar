import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('authToken'); // adjust key if needed
    if (token) {
        req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }
    return next(req);
};


// import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
//
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const token = localStorage.getItem('authTolen');
//         if (token) {
//             req = req.clone({
//                 headers: req.headers.set('Authorization', `Bearer ${token}`)
//             });
//         }
//         return next.handle(req);
//     }
// }
