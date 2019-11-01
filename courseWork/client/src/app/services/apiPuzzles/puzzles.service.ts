import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from '../../../assets/api-url';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiPuzzlesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private buildApiLink(path: string) {
    return `${apiUrl}${path}`;
  }

  public getById(id: string) {
    const url = this.buildApiLink('/puzzles/') + id;
    return  this.httpClient.get(url);
  }

  public deleteById(id: string) { 
    const url = this.buildApiLink('/puzzles/') + id;
    return this.httpClient.delete(url);
  }

  public getFilters() {
    const url = this.buildApiLink('/puzzles/filters');
    return this.httpClient.get(url);
  }

  public getPuzzles(limit: number, offset: number, filters) { 
    filters.limit = limit;
    filters.offset = offset;
    return this.httpClient.post(this.buildApiLink('/puzzles'), filters);
  }

  public insertPuzzleMultipart(puzzle: FormData) {
    const url = this.buildApiLink('/puzzles/new/mp');
    return this.httpClient.post(url, puzzle);
  }

}
