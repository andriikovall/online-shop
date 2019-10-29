import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from '../../../assets/api-url';

@Injectable({
  providedIn: 'root'
})
export class ApiPuzzlesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getFilters() {
    const url = `${apiUrl}/puzzles/filters`;
    return this.httpClient.get(url);
  }
}
