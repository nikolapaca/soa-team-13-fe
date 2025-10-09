import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour } from '../tour/model/tour.model';
import { jwtDecode } from 'jwt-decode';
import { OrderItem } from './model/orderItem.model';
import { ShoppingCart } from './model/shoppingCart.model';
import { TourPurchaseToken } from './model/tourPurchaseToken.model';

@Injectable({
  providedIn: 'root'
})

export class CartService{

  token: any;
    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
    }

  getTourById(tourId: number): Observable<Tour> {
    return this.http.get<Tour>('http://localhost:8070/tours/' + tourId, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  addItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>('http://localhost:8070/shopping/orderItems/', orderItem, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  getOrCreateCart(): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>('http://localhost:8070/shopping/', {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  createCart(): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>('http://localhost:8070/shopping/', {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  updateCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>('http://localhost:8070/shopping/', shoppingCart, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  checkout(): Observable<TourPurchaseToken[]> {
    return this.http.post<TourPurchaseToken[]>('http://localhost:8070/shopping/checkout/', {}, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  getTokens(): Observable<TourPurchaseToken[]> {
    return this.http.get<TourPurchaseToken[]>('http://localhost:8070/shopping/purchaseTokens/', {headers: {'Authorization': `Bearer ${this.token}`}})
  }
}
