import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from '../assets/api-url';


@Injectable({
  providedIn: 'root'
})


export class ApiUsersService { 
  
  constructor (
    private httpClient: HttpClient
  ) { }

  public getAll() {
    const url = `${apiUrl}/users`;
    return this.httpClient.get(url);
  }
} 
