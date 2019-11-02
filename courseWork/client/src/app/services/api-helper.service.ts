import { Injectable } from '@angular/core';
import { apiUrl } from '../../assets/api-url';


@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  constructor() { }

  public buildApiLink(path: string) {
    return `${apiUrl}${path}`;
  }
  
}