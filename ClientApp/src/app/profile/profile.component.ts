import { Component } from '@angular/core';
import { Profile } from '../models/profile.model';
import {jwtDecode} from 'jwt-decode';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  profile?: Profile;
  token: any;
  decodedToken: any;

  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
      if (this.token) {
        try {
          this.decodedToken = jwtDecode(this.token);
        } catch (error) {
        }
      }

      this.http.get<Profile>("http://localhost:8070/accounts/profiles/" + this.decodedToken.sub, {headers: {'Authorization': `Bearer ${this.token}`}}).subscribe({
          next: (res) => {
            this.profile = res;
            console.log("PROFIL: ", res);
          }
        })
  }

}
