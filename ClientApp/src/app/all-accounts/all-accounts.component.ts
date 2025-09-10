import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Account } from '../models/account.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-all-accounts',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './all-accounts.component.html',
  styleUrl: './all-accounts.component.css'
})
export class AllAccountsComponent implements OnInit{
  accounts: Account[] = []

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef){}

  ngOnInit(){
    var token = localStorage.getItem("token") || ''
    this.http.get<Account[]>('http://localhost:8070/accounts/', {headers: {'Authorization': `Bearer ${token}`}}).subscribe({
      next: (res) => {
        this.accounts = res;
        this.cdRef.detectChanges(); // ucitavanje 
      }
    })
  }
}
