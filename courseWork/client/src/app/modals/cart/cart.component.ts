import { Component, OnInit, Input } from '@angular/core';

import { CartItem } from '../../models/cartPuzzlesArray';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service';
import { CartService } from 'src/app/services/apiCarts/cart.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Puzzle } from 'src/app/models/puzzle.model';
import { ConfirmSafetyComponent } from '../confirm-safety/confirm-safety.component';
import { ApiOrdersService } from 'src/app/services/apiOrders/api-orders.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ShippingEditFixComponent } from "../shipping-edit-fix/shipping-edit-fix.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  puzzles: CartItem[];

  loading: boolean = true;

  @Input() public isOpenedByUser = true;
  @Input() public cartId: string;

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
    if (this.isOpenedByUser) {
      this.cartService.getCartPuzzles().subscribe((res: CartItem[]) => {
        this.loading = false;
        this.puzzles = res.filter(item => item.puzzle != null);
        console.log(this.puzzles);
      }, console.error);
    } else {
      this.cartService.getById(this.cartId).subscribe((res: any) => {
        this.loading = false;
        this.puzzles = res.puzzles.filter(item => item.puzzle != null);
        console.log(this.puzzles);
      }, console.error);
    }
  }
  

  filterResponse(res: any) {
    return res.cart.puzzles.filter(item => item.puzzle != null);
  }
  
  removePuzzle(puzzleId: string) {
    this.loading = true;
    this.cartService.removePuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = this.filterResponse(res);
      this.loading = false;
    }, console.error);
  }

  insertPuzzle(puzzleId: string) {
    this.loading = true;
    this.cartService.insertPuzzle(puzzleId).subscribe((res: any) => {
      this.puzzles = this.filterResponse(res);
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
      this.modal.close();
      this.alerts.success('Ваш заказ был принят в обработку! Наш менеджер свяжется с вами в ближайшем времени!');
    }, (err) => {
      console.log(err);
      this.alerts.error('Ошибка сервера, попробуйте позже'); 
    });
  }

  onOrder() {
    if (this.puzzles.length == 0) {
      return;
    }
    const modalRef = this.modalService.open(ConfirmSafetyComponent);
    modalRef.result.then(res => {
      if (res) {
        this.modalService.open(ShippingEditFixComponent).result.then(res => {
          if (res) {
            this.createOrder();
          }
        })
      }
    }, (reason) => {
    });
  }

  onBack() {
    this.modal.dismiss(false);
  }

}
