import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-published-tours',
  imports: [CommonModule],
  templateUrl: './published-tours.component.html',
  styleUrl: './published-tours.component.css'
})
export class PublishedToursComponent implements OnInit{
  tours: Tour[] = [];
  constructor(private service: TourService, private router: Router){}
  ngOnInit(){
    this.service.getPublished().subscribe({
      next: (res) => {
        this.tours = res;
      }
    })
  }
    onCardClick(tourId: number): void{
    this.router.navigate(['/tour', tourId]);
  }
}
