import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';
import { Router } from "@angular/router";

import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId: string;
  userRole: string;

  constructor(
    private linkBuilder: ApiHelperService,
    private httpClient: HttpClient, 
    private router: Router
  ) { 
    const role = this.getUserRole() || null;
    const userId = this.getUserId() || null;
    this.userId = userId;
    this.userRole = role;
  }

  public login(user) {
    const url = this.linkBuilder.buildApiLink('/auth/login');
    return this.httpClient.post(url, user)
      .pipe(
        tap(
          (res: any) => {
            localStorage.setItem('id', res.user._id);
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.user.role);
            this.setCurrentUserData(res.user._id, res.user.role);
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
    return this.userId !== null && this.userRole !== null;
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public getUserRole() {
    return localStorage.getItem('role');
  }

  public getUserId() {
    return localStorage.getItem('id');
  }

  public logout() {
    localStorage.clear();
    this.userId = null;
    this.userRole = null;
    this.router.navigate(['/']);
  }

}
