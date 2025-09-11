import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Tour } from '../model/tour.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tour-form',
  standalone: true,
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    MatOptionModule,
    HttpClientModule
  ]
})
export class TourFormComponent implements OnInit {

  tagList: string[] = [];
  readonly templateKeywords = signal<string[]>([]);

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    difficulty: new FormControl(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    cost: new FormControl(0, [Validators.required, Validators.min(0)]),
    status: new FormControl(0),
    tags: new FormControl(''),
    image: new FormControl('')
  });

  constructor(private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    const defaultTags = ["Hiking", "Walk", "Summer", "Spring", "See", "Mountain", "City", "Village"];
    this.templateKeywords.set([...defaultTags]);
    this.tagList = [...defaultTags];

    this.tourForm.patchValue({
      cost: 0,
      status: 0
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.tagList.includes(value)) {
      this.tagList.push(value);
      this.templateKeywords.set([...this.tagList]);
    }
    event.chipInput?.clear();
  }

  removeTag(tag: string): void {
    this.tagList = this.tagList.filter(t => t !== tag);
    this.templateKeywords.set([...this.tagList]);
  }

  tagToString() {
    let str = this.tagList.join(',');
    this.tourForm.value.tags = str;
  }

  addTour(): void {
    if(!this.tourForm.valid)
      return

    this.tagToString();
    var authorId = ""
    var token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
      if (token) {
        try {
          var decodedToken = jwtDecode(token); // Koristite `default`
          authorId = decodedToken['sub']!;
        } catch (error) {
        }
      }
    const newTour: Tour = {
      id: 0,
      name: this.tourForm.value.name || "",
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      description: this.tourForm.value.description || "",
      cost: this.tourForm.value.cost || 0,
      status: 0,
      tags: this.tourForm.value.tags || "",
      length: 0,
      authorId: authorId,
      reviews : [],
      image: ""
    };
    this.http.post<Tour>('http://localhost:8070/tours/', newTour, {headers: {'Authorization': `Bearer ${token}`}}).subscribe({
      next: (res) => {
        this.router.navigate(["tours"]);
      }
    })
  }
}
