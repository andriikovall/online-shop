import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';

import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId: string = null;
  userRole: string = null;

  constructor(
    private linkBuilder: ApiHelperService,
    private httpClient: HttpClient
  ) { }

  public login(user) {
    const url = this.linkBuilder.buildApiLink('/auth/login');
    return this.httpClient.post(url, user)
      .pipe(
        tap(
          (res: any) => {
            localStorage.setItem('token', res.token)
            localStorage.setItem('role', res.role)
            console.log(res);
            this.setCurrentUserData(res._id, res.role);
          }
        )
      )
  }

  public register(user) {
    const url = this.linkBuilder.buildApiLink('/auth/register');
    return this.httpClient.post(url, user);
  }

  public setCurrentUserData(userId, userRole) {
    this.userId = userId;
    this.userRole = userRole;
  }

  public userIsAdmin() {
    return this.userRole.toLowerCase() === 'admin';
  }

  public userIsManager() {
    return this.userRole.toLowerCase() === 'manager';
  }

  public isAuthenticated() {
    // const token = this.getToken();
    // return tokenNotExpired(null, token); @todo learn
    return this.userId === null || this.userRole === null;
  }

  public getToken() {
    return localStorage.getItem('token');
  }

}
