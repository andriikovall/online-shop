import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  constructor() { }

  public buildApiLink(path: string) {
    return `${environment.apiUrl}${path}`;
  }

}
