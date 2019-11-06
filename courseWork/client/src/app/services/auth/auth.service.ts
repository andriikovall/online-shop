import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';
import { Router } from "@angular/router";

import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private linkBuilder: ApiHelperService,
    private httpClient: HttpClient, 
    private router: Router
  ) { 
  }

  public login(user) {
    const url = this.linkBuilder.buildApiLink('/auth/login');
    return this.httpClient.post(url, user)
      .pipe(
        tap(
          (res: any) => {
            localStorage.setItem('token', res.token);
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
    return this.userRole.toLowerCase() === 'manager' || this.userIsAdmin();
  }

  public isAuthenticated() {
    // const token = this.getToken();
    // return tokenNotExpired(null, token); @todo learn
    return this.userId !== '' && this.userRole !== 'guest';
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  get userRole() {
    return localStorage.getItem('role') || 'guest';
  }
  set userRole(role: string) {
    localStorage.setItem('role', role);
  }

  get userId() {
    return localStorage.getItem('id') || '';
  }

  set userId(id: string) {
    localStorage.setItem('id', id);
  }

}
