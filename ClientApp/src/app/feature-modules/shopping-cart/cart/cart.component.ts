import { Component, signal } from '@angular/core';
import { OrderItem } from '../model/orderItem.model';
import { CartService } from '../cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ShoppingCart } from '../model/shoppingCart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  shoppingCart: ShoppingCart = {
    id: '',
    accountId: '',
    items: []
  };

  constructor(private cartService: CartService) { }

  ngOnInit(): void{
  this.cartService.getOrCreateCart().subscribe({
      next : (result) => {
          this.shoppingCart = result;
          console.log("DOBAVIO SAM CART: ", result);
      }
    })
  }


  trackById = (_: number, it: OrderItem) => it.tourId;

  get total(): number { return this.shoppingCart.items.reduce((s,i)=>s+i.price,0); }

  remove(item: OrderItem) {

  this.shoppingCart.items = this.shoppingCart.items.filter(i => i !== item);

  this.cartService.updateCart(this.shoppingCart).subscribe({
    next : (result) => {
        this.shoppingCart = result;
        console.log("IZBACIO SAM ITEM: ", result);
    }
  })
  }

  checkout() {
    this.cartService.checkout().subscribe({
      next : (result) => {
        this.shoppingCart.items = [];
        console.log("CHECKOUT", result);
      }
    })
  }
}
