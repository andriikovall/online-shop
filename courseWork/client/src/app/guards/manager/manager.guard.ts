import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate, CanActivateChild {

  constructor(
    private auth: AuthService, 
    private location: Location
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isManager = this.auth.userIsAdmin() || this.auth.userIsManager();
    if (!isManager) {
      alert('Вы не имеете доступ к этому'); //@todo сделать норм алерты
      this.location.back();
    }
    return isManager;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }
  
}
