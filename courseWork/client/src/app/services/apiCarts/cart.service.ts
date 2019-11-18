import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';
import { User } from '../../models/user.model';
import { AuthService } from '../auth/auth.service';
import { ApiUsersService } from '../apiUsers/api-users.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private httpClient: HttpClient,
    private linkBuilder: ApiHelperService, 
    private auth: AuthService, 
    private userService: ApiUsersService
  ) { }


  private buildApiLink(path: string) {
    return this.linkBuilder.buildApiLink(path);
  }

  // public getById(id: string) {
  //   const url = this.buildApiLink('/carts/') + id;
  //   return this.httpClient.get(url);
  // }

  public insertPuzzle(puzzleId: string) {
    const url = this.buildApiLink('/carts/insert/') + puzzleId;
    return this.httpClient.post(url, {});
  }

  public removePuzzle(puzzleId: string) {
    const url = this.buildApiLink('/carts/remove/') + puzzleId;
    return this.httpClient.post(url, {});
  }

  public getCartPuzzles() {
    const url = this.buildApiLink('/carts');
    return this.httpClient.get(url);
  }

}
