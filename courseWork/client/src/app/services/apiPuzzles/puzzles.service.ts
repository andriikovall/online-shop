import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';
import { Puzzle } from 'src/app/models/puzzle.model';

@Injectable({
  providedIn: 'root'
})
export class ApiPuzzlesService {

  constructor(
    private httpClient: HttpClient,
    private linkBuilder: ApiHelperService
  ) { }

  private buildApiLink(path: string) {
    return this.linkBuilder.buildApiLink(path);
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

  public insertPuzzleMultipart(puzzle: Puzzle) {
    const formData = this.getFormDataFromObj(puzzle);
    const url = this.buildApiLink('/puzzles/new/mp');
    return this.httpClient.post(url, formData);
  }

  public updatePuzzleMultipart(puzzle: Puzzle, id: string) {
    const formData = this.getFormDataFromObj(puzzle);
    const url = this.buildApiLink('/puzzles/' + id + '/mp');
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

  public subscribe(puzzleId: string) {
    const url = this.linkBuilder.buildApiLink('/puzzles/') + puzzleId + '/subscribe';
    return this.httpClient.patch(url, {});
  }

}
