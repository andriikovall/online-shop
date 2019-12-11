import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  @Input() order: Order;

  orderStates = [
    '', 'Новый', 'В работе', 'Выполнен'
  ];

  constructor(
    public modal: NgbActiveModal,
  ) { }

  ngOnInit() {

  }

}
