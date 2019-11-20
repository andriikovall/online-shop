import { Component, OnInit } from '@angular/core';

import { CartItem } from '../../models/cartPuzzlesArray';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service';
import { CartService } from 'src/app/services/apiCarts/cart.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  puzzles: CartItem[];

  loading: boolean = false;

  constructor(
    private usersService: ApiUsersService,
    private cartService: CartService, 
    public modal: NgbActiveModal, 
  ) { }

  ngOnInit() {
    this.updatePuzzles();
  }

  private updatePuzzles() {
    this.puzzles = [];
    this.loading = true;
    this.cartService.getCartPuzzles().subscribe((res: CartItem[]) => {
      this.loading = false;
      this.puzzles = res;
    }, console.error);
  }


  removePuzzle(puzzleId: string) {
    this.cartService.removePuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = res.cart.puzzles;
      this.updatePuzzles();
    }, console.error);
  }

  insertPuzzle(puzzleId: string) {
    this.cartService.insertPuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = res.cart.puzzles;
      this.updatePuzzles();
    }, console.error);
  }

  get cartFullPrice() {
    if (this.puzzles) {
      return this.puzzles.reduce((sum, curr) => {
        if (!curr.puzzle)
            return sum;
        return sum + curr.count * (curr.puzzle.price || 0);
      }, 0);
    }
  }

}
