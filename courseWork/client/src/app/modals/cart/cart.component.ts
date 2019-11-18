import { Component, OnInit } from '@angular/core';

import { CartItem } from '../../models/cartPuzzlesArray';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service'; 
import { CartService } from 'src/app/services/apiCarts/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  puzzles: CartItem[];

  constructor (
    private usersService: ApiUsersService, 
    private cartService:  CartService
  ) { }

  ngOnInit() {
    this.cartService.getCartPuzzles().subscribe((res: CartItem[]) => {
      this.puzzles = res;
    }, console.error);

  }

  removePuzzle(puzzleId: string) {
    this.cartService.removePuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = res.cart.puzzles;
      console.log(this.puzzles);
    }, console.error);
  }

  insertPuzzle(puzzleId: string) {
    this.cartService.insertPuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = res.cart.puzzles;
      console.log(this.puzzles);
    }, console.error);
  }

}
