import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';
import { Router } from "@angular/router";

import { AlertService } from '../../services/alert/alert.service';


import { tap } from 'rxjs/operators';

import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private linkBuilder: ApiHelperService,
    private httpClient: HttpClient,
    private router: Router,
    private alerts: AlertService
  ) {
  }

  public login(user) {
    const url = this.linkBuilder.buildApiLink('/auth/login');
    return this.httpClient.post(url, user)
      .pipe(
        tap(
          (res: any) => {
            localStorage.setItem('token', res.token);
          }
        )
      )
  }

  public loginViaTelegram(telegramResponse) {
    const url = this.linkBuilder.buildApiLink('/auth/login/telegram');
    return this.httpClient.post(url, telegramResponse)
      .pipe(
        tap(
          (res: any) => {
            localStorage.setItem('token', res.token);
          }
        )
      )
  }

  public register(user) {
    const url = this.linkBuilder.buildApiLink('/auth/register');
    return this.httpClient.post(url, user);
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
    const defaultRole = 'guest';
    const token = this.getToken();
    if (!token) return defaultRole;

    const decodedToken = this.getDecodedAccessToken(token);
    if (decodedToken) return decodedToken.role;
    return defaultRole;
  }

  get userId() {
    const defaultId = '';
    const token = this.getToken();
    if (!token) return defaultId;

    const decodedToken = this.getDecodedAccessToken(token);
    if (decodedToken) return decodedToken._id;
    return defaultId;
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
}
