import { AuthService } from "../auth/auth.service";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private router: Router) { } 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization:  "Bearer " + this.authService.getToken()
        }
      })
    }
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.router.navigate(['/'], {
              queryParams: { 
                sessionExpired: true
              }
            })
          }
          return throwError(error)
        }
      )
    )
  }

}