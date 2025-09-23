import { Component } from '@angular/core';
import { Profile } from '../models/profile.model';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile?: Profile;
  token: string = '';
  decodedToken: any;
  editing = false;

  // privremene promenljive za edit
  editName = '';
  editSurname = '';
  editMotto = '';
  editBio = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.token = localStorage.getItem('token') ?? '';
    if (this.token) {
      try {
        this.decodedToken = jwtDecode(this.token);
        console.log("DECODED TOKEN: ", this.decodedToken);
      } catch (error) {
        console.error(error);
      }
    }
    this.loadProfile();
  }

  loadProfile() {
    this.http.get<Profile>(`/accounts/profiles/${this.decodedToken.sub}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    }).subscribe({
      next: (res) => {
        this.profile = res;
        // inicijalizacija polja za edit
        this.editName = res.name;
        this.editSurname = res.surname;
        this.editMotto = res.motto;
        this.editBio = res.bio;
      },
      error: (err) => console.error(err)
    });
  }

  toggleEdit() {
  if (!this.profile) return;

  if (this.editing) {
    // Save mode
    const profileDto = {
      account_id: this.decodedToken.sub,
      name: this.editName || undefined,
      surname: this.editSurname || undefined,
      motto: this.editMotto || undefined,
      bio: this.editBio || undefined
      // profile_picture po potrebi
    };

    this.http.put<Profile>(`/accounts/profiles/`, profileDto, {
      headers: { 
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (res) => {
        this.profile = res;
        this.editing = false;
      },
      error: (err) => console.error(err)
    });

  } else {
    // Enter edit mode
    this.editing = true;
  }
}

}
