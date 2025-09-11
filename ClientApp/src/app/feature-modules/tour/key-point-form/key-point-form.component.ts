import { Component } from '@angular/core';
import { MapComponent } from '../../../shared/map-component/map-component';
import { CommonModule } from '@angular/common';
import { TourService } from '../tour.service';
import { KeyPoint } from '../model/keyPoint.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'app-key-point-form',
  standalone: true,
  imports: [ MapComponent, CommonModule, FormsModule],
  templateUrl: './key-point-form.component.html',
  styleUrl: './key-point-form.component.css'
})
export class KeyPointFormComponent {

  imagePreview: string | null = null;
  lat: number = 0;
  lng: number = 0;
  name: string = '';
  description: string = '';
  selectedImage: File | null = null;

  tourId!: number;
  tour: Tour = {
    id: 0,
    name: '',
    difficulty: 0,
    description: '',
    cost: 0,
    status: '',
    tags: '',
    keyPoints: [],
    length: 0,
    authorId: '',
    image: '',
    reviews: []
  };

  constructor(private service: TourService, private route: ActivatedRoute, private router: Router){ }

  ngOnInit(): void{
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));
    console.log('Tour ID:', this.tourId);

      this.service.getTourById(this.tourId).subscribe({
      next : (result) =>{
          this.tour = {
            ...result,
            reviews: result.reviews ?? []
          };
          console.log("DOBAVIO SAM TURU: ", result);
      }
    })
  }

onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files && input.files[0];
  if (!file) { this.imagePreview = null; return; }
  const reader = new FileReader();
  reader.onload = () => this.imagePreview = reader.result as string;
  reader.readAsDataURL(file);
}

onCreate() {
    const keyPoint: KeyPoint = {
    name: this.name,
    description: this.description,
    image: this.imagePreview ?? '',
    latitude: this.lat,
    longitude: this.lng
  };

  this.tour?.keyPoints.push(keyPoint);

  console.log("OVO SALJEM: ", this.tour);
  this.service.updateTour(this.tourId, this.tour!).subscribe({
      next : (result) =>{
          console.log("OVO SALJEM 222: ", this.tour);
          this.router.navigate(['/tour/', this.tourId]);
      }
    })
}

onCoords({ lat, lng }: { lat: number; lng: number }) {
  this.lat = lat;
  this.lng = lng;
}
}
