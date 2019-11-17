import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

import { Location } from '@angular/common';
import { AlertService } from 'src/app/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate, CanActivateChild {

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
    const isManager = this.auth.userIsAdmin() || this.auth.userIsManager();
    if (!isManager) {
      this.router.navigate(['/forbidden'], {queryParams: { msg: 'Вы не имеете доступа к данной странице'}})
    }
    return isManager;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

}
