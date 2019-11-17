import { AuthService } from "../auth/auth.service";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, subscribeOn } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService } from '../alert/alert.service';

@Injectable()

export class TokenInterseptorService implements HttpInterceptor {

  constructor( 
    private authService: AuthService,
    private alerts: AlertService, 
    private location: Location
    ) { }

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
            this.alerts.info('Вы не авторизированы, либо закончилось время сессии');
            this.authService.logout();
          } else if (error.status === 403) {
            this.location.back();
            this.alerts.info('У вас нет прав на просмотр этой страницы');
          }
          return throwError(error)
        }
      )
    )
  }

}