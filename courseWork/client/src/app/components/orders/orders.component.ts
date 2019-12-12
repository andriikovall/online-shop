import { Component, OnInit, setTestabilityGetter } from '@angular/core';

import { Order } from "../../models/order.model";
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiOrdersService } from 'src/app/services/apiOrders/api-orders.service';
import { PaginationInstance } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfirmSafetyComponent } from 'src/app/modals/confirm-safety/confirm-safety.component';
import { CartComponent } from 'src/app/modals/cart/cart.component';
import { OrderDetailsComponent } from 'src/app/modals/order-details/order-details.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
}) 
export class OrdersComponent implements OnInit {

  orders: Order[] = []; 
  searchedName: string = '';

  orderStates: string[] = [
    'Новый',  
    'В работе', 
    'Выполнен'
  ];

  orderStatusesToUpdate = {};

  statesForm: FormGroup;

  searchedNameNotFound: string = '';

  totalOrders: number;

  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 6,
    currentPage: 1
  };

  constructor(
    private alerts: AlertService, 
    private ordersService: ApiOrdersService, 
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.statesForm = new FormGroup({
      '1': new FormControl({ value: true, disabled: false }),  
      '2': new FormControl({ value: true, disabled: false }), 
      '3': new FormControl({ value: true, disabled: false }), 
      _id: new FormControl('')
    });
    this.onSearch();
  }
  
  onSearch() {
    this.updateOrders();
  }
  
  getFilters() {
    let states = [];
    if (this.statesForm.disabled) {
      return null;
    }
    for (const key in this.statesForm.value) {
      if (this.statesForm.value[key]) {
        states.push(parseInt(key));
      }
    }
    return {
      states, 
      _id: this.statesForm.value._id
    };
  }

  initOrderStatuses() {
    this.orders.forEach(o => 
      this.orderStatusesToUpdate[o._id] = {
        cur: o.state, 
        next: o.state
      }
    );
  }
  
  public updateOrders() {
    this.orders = null;
    const limit = this.config.itemsPerPage;
    const offset = (this.config.currentPage - 1) * this.config.itemsPerPage;
    const filters = this.getFilters();
    this.ordersService.get(limit, offset, filters).subscribe((res: any) => {
      this.orders = res.orders; 
      this.totalOrders = res.count;
      this.initOrderStatuses();
    }, (err) => {
      console.log(err);
      this.alerts.error('Серверная ошибка, попробуйте позже');
    })
  }


  onIgnore(event) {
    if (this.statesForm.enabled)
      this.statesForm.disable();
    else 
      this.statesForm.enable();
  }  

  changeState(orderId: string) {
    const newState = this.orderStatusesToUpdate[orderId].next;
    this.ordersService.setState(orderId, newState).subscribe(res => {
      this.alerts.success('Статус заказа успешно изменён!');
      this.orderStatusesToUpdate[orderId].cur = newState;
      const changedOrder = this.orders.find((o) => o._id == orderId);
      if (changedOrder)
        changedOrder.state = newState;
    }, err => {
      console.log(err);
      this.alerts.info('Случилась ошибка, попробуйте позже');
    })
  }
  
  onChangeState(orderId: string) {
    this.modalService.open(ConfirmSafetyComponent).result.then(res => {
      if (res) {
        this.changeState(orderId);
      }
    }, reason => {

    })
  }

  onOrderDetails(order: Order) {
    const modalRef = this.modalService.open(OrderDetailsComponent);
    modalRef.componentInstance.order = order; 
  }

  openCart(cartId: string) {
    const modalRef = this.modalService.open(CartComponent);
    modalRef.componentInstance.isOpenedByUser = false;
    modalRef.componentInstance.cartId = cartId;
  }

  pageChanged(pageNum) {
    this.config.currentPage = pageNum;
    this.updateOrders();
  }
}
