import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class UserEditGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private location: Location,
    private alerts: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const urlPathArray = state.url.split('/');
      const userToUpdateId = urlPathArray[urlPathArray.length - 1] || '';
      const currentUserId =  this.auth.userId;
      const canEdit = (userToUpdateId == currentUserId);
      if (!canEdit) {
        this.router.navigate(['/'], {queryParams: { msg: 'Вы не имеете доступа к данной странице'}})
      }
      return canEdit;  
  }
  
}
