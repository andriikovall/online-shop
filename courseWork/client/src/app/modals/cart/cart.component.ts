import { Component, OnInit } from '@angular/core';

import { CartItem } from '../../models/cartPuzzlesArray';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service';
import { CartService } from 'src/app/services/apiCarts/cart.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Puzzle } from 'src/app/models/puzzle.model';
import { ConfirmSafetyComponent } from '../confirm-safety/confirm-safety.component';
import { ApiOrdersService } from 'src/app/services/apiOrders/api-orders.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  puzzles: CartItem[];

  loading: boolean = true;

  constructor(
    private usersService: ApiUsersService,
    private cartService: CartService, 
    public modal: NgbActiveModal, 
    private modalService: NgbModal,
    private orderService: ApiOrdersService,
    private alerts: AlertService
  ) { }

  ngOnInit() {
    this.updatePuzzles();
  }

  private updatePuzzles() {
    this.puzzles = [];
    this.cartService.getCartPuzzles().subscribe((res: CartItem[]) => {
      this.loading = false;
      this.puzzles = res.filter(item => item.puzzle != null);
      console.log(this.puzzles);
    }, console.error);
  }
  
  
  removePuzzle(puzzleId: string) {
    this.loading = true;
    this.cartService.removePuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = res.cart.puzzles;
      this.loading = false;
    }, console.error);
  }

  insertPuzzle(puzzleId: string) {
    this.loading = true;
    this.cartService.insertPuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = res.cart.puzzles;
      this.loading = false;
    }, console.error);
  }

  get cartFullPrice() {
    if (this.puzzles) {
      return this.puzzles.reduce((sum, curr) => {
        if (!curr.puzzle)
            return sum;
        return sum + curr.count * ((curr.puzzle as Puzzle).price || 0);
      }, 0);
    }
  }

  createOrder() {
    this.orderService.makeOrder().subscribe((res) => {
      this.alerts.success('Ваш заказ был принят в обработку!');
    }, (err) => {
      console.log(err);
      this.alerts.error('Ошибка сервера, попробуйте позже'); 
    })
  }

  onOrder() {
    if (this.puzzles.length == 0) {
      return;
    }
    const modalRef = this.modalService.open(ConfirmSafetyComponent);
    modalRef.result.then(res => {
      if (res) {
        this.createOrder();
      }
    }, (reason) => {
    });
  }

  onBack() {
    this.modal.dismiss(false);
  }

}
