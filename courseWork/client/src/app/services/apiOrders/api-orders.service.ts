import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelperService } from '../api-helper.service';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiOrdersService {

  constructor(
    private httpClient: HttpClient,
    private linkBuilder: ApiHelperService, 
  ) { }

  public get(limit: number, offset: number, filters) {
    const url = this.linkBuilder.buildApiLink('/orders');
    return this.httpClient.post(url, { limit, offset, filters });
  }

  public getById(id: string) {
    const url = this.linkBuilder.buildApiLink('/orders/') + id;
    return this.httpClient.get<Order>(url);
  }

  public setState(orderId: string, state: number) {
    const url = this.linkBuilder.buildApiLink(`/orders/setstate/${orderId}/${state}`);
    return this.httpClient.patch(url, {});
  }

  public makeOrder(shippingData) {
    const url = this.linkBuilder.buildApiLink('/orders/new');
    return this.httpClient.post(url, shippingData);
  }

  public updateOrder(order: Order) {
    const url = this.linkBuilder.buildApiLink('/orders/') + order._id;
    return this.httpClient.patch(url, order);
  }

}
