import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';



@Injectable({
  providedIn: 'root'
})


export class ApiUsersService { 
  
  constructor (
    private httpClient: HttpClient, 
    private linkBuilder: ApiHelperService
  ) { }

  public getAll() {
    const url = this.linkBuilder.buildApiLink('/users/all');
    return this.httpClient.get(url);
  }

  public getById(userId: string) {
    const url =  this.linkBuilder.buildApiLink('/users/') + userId;
    return this.httpClient.get(url);
  }
} 
