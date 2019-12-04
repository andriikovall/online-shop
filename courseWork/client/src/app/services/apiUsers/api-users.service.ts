import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';

import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})


export class ApiUsersService {

  constructor(
    private httpClient: HttpClient,
    private linkBuilder: ApiHelperService
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

  public updateUserFormData(user: User) {
    const formData = this.getFormDataFromObj(user);
    const url = this.linkBuilder.buildApiLink('/users/') + user._id +'/mp';
    console.log('updateUserFormData', url);
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
