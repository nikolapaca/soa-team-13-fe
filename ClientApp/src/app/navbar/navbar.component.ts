import { CommonModule } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  token: any;
  decodedToken: any;
  loggledUserRole: string = '';
  role: string = '';

  constructor(private router: Router){}

  ngOnInit(): void {
    this.token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
    if (this.token) {
      try {
        this.decodedToken = jwtDecode(this.token); // Koristite `default`
        this.role = this.decodedToken['role'];
      } catch (error) {
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
    if (this.token) {
      try {
        this.decodedToken = jwtDecode(this.token); // Koristite `default`
        this.role = this.decodedToken['role'];
      } catch (error) {
      }
    }
  }

  allAccounts(){
    this.router.navigate(["all-accounts"]);
  }

  login(){
    this.router.navigate(["login"]);
  }
  map(){
  this.router.navigate(["map"]);
  }
  profile(){
    this.router.navigate(["profile"]);
  }
  myTours(){
    this.router.navigate(["tours"]);
  }
  cart(){
    this.router.navigate(["cart"]);
  }

  blogs(){
    this.router.navigate(["blogs"]);
  }

  getToken(): string|null{
    return localStorage.getItem("token");
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.clear();
    this.router.navigate(["login"]);
  }

  publishedTours(){
    this.router.navigate(["published-tours"]);
  }
}
