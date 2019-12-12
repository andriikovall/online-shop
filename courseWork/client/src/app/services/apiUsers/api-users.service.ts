import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';

import { User } from '../../models/user.model';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})


export class ApiUsersService {

  constructor(
    private httpClient: HttpClient,
    private linkBuilder: ApiHelperService, 
    private auth: AuthService
  ) { }

  public get(limit: number, offset: number, name: string = '') {
    const url = this.linkBuilder.buildApiLink('/users');
    return this.httpClient.post(url, { limit, offset, name });
  }

  public getById(userId: string) {
    const url = this.linkBuilder.buildApiLink('/users/') + userId;
    return this.httpClient.get<User>(url); 
  }

  public updateUser(user: User) {
    const url = this.linkBuilder.buildApiLink('/users/') + user._id;
    return this.httpClient.patch(url, user);
  }

  public addTelegram(telegramResponse) {
    const url = this.linkBuilder.buildApiLink('/users/add_telegram');
    return this.httpClient.patch(url, telegramResponse)
    .pipe(
      tap(
        (res: any) => {
          this.auth.loginViaTelegram(telegramResponse);
        }
      )
    )
  }

  public updateUserRole(user: User) {
    const params = new HttpParams().set('update_role', 'true');
    console.log(params, 'here'); 
    const url = this.linkBuilder.buildApiLink('/users/') + user._id;
    return this.httpClient.patch(url, user, { params });
  }

  public updateUserFormData(user: User) {
    const formData = this.getFormDataFromObj(user);
    const url = this.linkBuilder.buildApiLink('/users/') + user._id +'/mp';
    return this.httpClient.patch(url, formData);
  }

  private getFormDataFromObj(obj: object | any) {
    const uploadFormData = new FormData();
    for (const key in obj) {
      if ((typeof obj[key]).toLowerCase() === 'file' && obj.name)
        uploadFormData.append(key, obj[key], obj.name);
      else
        uploadFormData.append(key, obj[key]);
    }
    return uploadFormData;
  }


} 
