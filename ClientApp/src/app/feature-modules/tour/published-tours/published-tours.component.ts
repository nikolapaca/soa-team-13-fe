import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../shopping-cart/cart.service';
import { OrderItem } from '../../shopping-cart/model/orderItem.model';
import { TourPurchaseToken } from '../../shopping-cart/model/tourPurchaseToken.model';
import { ShoppingCart } from '../../shopping-cart/model/shoppingCart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-published-tours',
  imports: [CommonModule],
  templateUrl: './published-tours.component.html',
  styleUrl: './published-tours.component.css'
})
export class PublishedToursComponent implements OnInit{
  tours: Tour[] = [];
  purchaseTokens: TourPurchaseToken[] = [];
  shoppingCart: ShoppingCart = {
    id: '',
    accountId: '',
    items: []
  };

  constructor(private service: TourService, private cartService: CartService, private router: Router){}

  ngOnInit(){
    this.service.getPublished().subscribe({
      next: (res) => {
        this.tours = res;
        this.checkBoughtTours();
      }
    })
  }

  checkBoughtTours() {
    this.cartService.getTokens().subscribe({
      next: (res) => {
        this.purchaseTokens = res;
        this.checkToursInCart();
        console.log("tokeni", this.purchaseTokens);
      }
    })
  }

  checkToursInCart() {
    this.cartService.getOrCreateCart().subscribe({
      next: (res) => {
        this.shoppingCart = res;
        this.updateTourStates();
      }
    })
  }

  updateTourStates(){
    const tokens = this.purchaseTokens ?? [];
    const items  = this.shoppingCart?.items ?? [];

    const purchasedIds = new Set<number>(tokens.map(t => Number((t as any).tourId ?? (t as any).TourId)));
    const cartIds      = new Set<number>(items.map(i => Number(i.tourId)));

    this.tours = (this.tours ?? []).map(t => {
      const id = Number(t.id);
      const isPurchased = purchasedIds.has(id);
      const isInCart    = cartIds.has(id);

      return {
        ...t,
        purchased: isPurchased,
        inCart: !isPurchased && isInCart
      };
    });
  }

  addToCart(tour: Tour) {

    const orderItem: OrderItem = {
      name: tour.name,
      price: tour.cost,
      tourId: tour.id
    };

    this.cartService.addItem(orderItem).subscribe({
      next : (result) =>{
        this.checkToursInCart();
      }
    })

  }

  onCardClick(tourId: number): void{
    this.router.navigate(['/tour', tourId]);
  }
}
