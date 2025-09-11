import { Component } from '@angular/core';
import { Tour } from '../model/tour.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../../../shared/map-component/map-component';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../tour.service';
import { KeyPointCardComponent } from '../key-point-card/key-point-card.component';

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent, KeyPointCardComponent],
  templateUrl: './tour.component.html',
  styleUrl: './tour.component.css'
})
export class TourComponent {

  tour?: Tour;
  tourId: number = 1;

  constructor(private router: Router, private route: ActivatedRoute, private service: TourService) { }

  ngOnInit(): void{

  this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));

  this.service.getTourById(this.tourId).subscribe({
      next : (result) =>{
          this.tour = result;
          console.log("DOBAVIO SAM TURU: ", result);
      }
    })
  }

  onCoords(p: { lat: number; lng: number }) {}

  onAddKeyPoint() {
    this.router.navigate(['/key-point/', this.tourId]);
  }

  onDeleteKeyPoint(id: number) {

    this.service.getTourById(this.tourId).subscribe({
        next : (result) =>{
            this.tour = result;
        }
      })
  }
}
