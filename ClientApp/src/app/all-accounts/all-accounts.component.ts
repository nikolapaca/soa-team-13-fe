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
        this.cdRef.detectChanges();
      }
    })
  }

  blockUser(userId: string): void{
    var token = localStorage.getItem("token") || ''
    this.http.post(
      'http://localhost:8070/accounts/' + userId + '/block',
      null,
      {
        headers: {'Authorization': `Bearer ${token}`},
        responseType: 'text' as const,
      }
    ).subscribe({
      next: (_msg) =>  {
        const user = this.accounts.find(acc => acc.id === userId);
        if (user) {
          user.blocked = true;
        }
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Greška prilikom blokiranja:", err);
      }
    })
  }
}
