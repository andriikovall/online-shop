import { Component, OnInit } from '@angular/core';

import { Order } from "../../models/order.model";
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiOrdersService } from 'src/app/services/apiOrders/api-orders.service';
import { PaginationInstance } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
}) 
export class OrdersComponent implements OnInit {

  orders: Order[] = []; 
  searchedName: string = '';

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
  ) { }

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.updateOrders();
  }

  public updateOrders() {
    this.orders = null;
    const limit = this.config.itemsPerPage;
    const offset = (this.config.currentPage - 1) * this.config.itemsPerPage;
    this.ordersService.get(limit, offset, this.searchedName).subscribe((res: any) => {
      this.orders = res.orders; 
      if (this.orders.length == 0)
        this.searchedNameNotFound = this.searchedName;
      this.totalOrders = res.count;
    }, (err) => {
      console.log(err);
      this.alerts.error('Серверная ошибка, попробуйте позже');
    })
  }

}
