import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/services/alert/alert.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private auth: AuthService, 
    private location: Location, 
    private alerts: AlertService, 
    private router: Router
  ) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.auth.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/forbidden'], {queryParams: { msg: 'Пожалуйста авторизируйтесь'}});
    }
      return isAuthenticated;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true; //@todo можно смотреть на других юзеров пока нету пагинации и посика друзей и тд
  }

}
