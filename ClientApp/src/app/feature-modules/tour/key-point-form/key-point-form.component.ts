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
  kpId?: number;
  isEdit?: boolean;
  tour!: Tour;
  keyPoint?: KeyPoint;

  constructor(private service: TourService, private route: ActivatedRoute, private router: Router){ }

  ngOnInit(): void{
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));
    console.log('Tour ID:', this.tourId);

    this.route.paramMap.subscribe(pm => {
      this.tourId = Number(pm.get('tourId'));
      const kp = pm.get('kpId');
      this.kpId = kp ? Number(kp) : undefined;
      this.isEdit = !!this.kpId;
      this.loadTourAndPrefill();
    });

    if(this.kpId)
      this.service.getKeyPoint(this.kpId).subscribe({
          next : (result) =>{
              this.keyPoint = result;
          }
        })
  }

loadTourAndPrefill() {
    this.service.getTourById(this.tourId).subscribe({
      next : (result) =>{
          this.tour = {
            ...result,
            reviews: result.reviews ?? []
          };
          console.log("DOBAVIO SAM TURU: ", result);
          if (this.isEdit && this.kpId != null) {
            const kp = this.tour.keyPoints.find(k => Number(k.id) === Number(this.kpId));
            if (kp) {
              this.patchFromKeyPoint(kp);
            } else {
              console.warn('KeyPoint nije pronađen za kpId:', this.kpId);
            }
          }
      }
    })
}

private patchFromKeyPoint(kp: KeyPoint) {
  this.name = kp.name ?? '';
  this.description = kp.description ?? '';
  this.imagePreview = kp.image || null;
  this.lat = Number(kp.latitude ?? 0);
  this.lng = Number(kp.longitude ?? 0);
}

onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files && input.files[0];
  if (!file) { this.imagePreview = null; return; }
  const reader = new FileReader();
  reader.onload = () => this.imagePreview = reader.result as string;
  reader.readAsDataURL(file);
}

onSubmit() {

    const keyPoint: KeyPoint = {
    name: this.name,
    description: this.description,
    image: this.imagePreview ?? '',
    latitude: this.lat,
    longitude: this.lng
  };

  if(this.isEdit && this.kpId != null){
    console.log("IF");
     const idx = this.tour.keyPoints.findIndex(k => Number(k.id) === Number(this.kpId));

    if (idx >= 0) {
      const current = this.tour.keyPoints[idx];

      const updated: KeyPoint = { ...current, ...keyPoint, id: current.id };

      this.tour.keyPoints = [
        ...this.tour.keyPoints.slice(0, idx),
        updated,
        ...this.tour.keyPoints.slice(idx + 1)
      ];
  }
}else{
    console.log("ELSE");
    this.tour.keyPoints.push(keyPoint);
  }

  this.service.updateTour(this.tourId, this.tour!).subscribe({
      next : (result) =>{
          this.router.navigate(['/tour/', this.tourId]);
      }
    })
}

onCoords({ lat, lng }: { lat: number; lng: number }) {
  this.lat = lat;
  this.lng = lng;
}
}
