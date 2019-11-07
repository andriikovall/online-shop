import { AuthService } from "../auth/auth.service";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()

export class TokenInterseptorService implements HttpInterceptor {

  constructor( private authService: AuthService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.authService.getToken()
        }
      })
    }
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            alert('Вы не авторизированы, либо закончилось время сессии');
          }
          return throwError(error)
        }
      )
    )
  }

}