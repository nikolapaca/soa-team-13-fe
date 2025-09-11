import { Component } from '@angular/core';
import { MapComponent } from '../../../shared/map-component/map-component';
import { CommonModule } from '@angular/common';
import { TourService } from '../tour.service';
import { KeyPoint } from '../model/keyPoint.model';
import { FormsModule } from '@angular/forms';

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

  constructor(private service: TourService){ }

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

  this.service.addKeyPoint(keyPoint).subscribe({
      next : (result) =>{
          console.log("DODAT KEY POINT: ", result);
      }
    })

    // this.name = "";
    // this.description = "";
    // this.imagePreview = "";
    // this.lat = 0;
    // this.lng = 0;
}

onCoords({ lat, lng }: { lat: number; lng: number }) {
  this.lat = lat;
  this.lng = lng;
}
}
