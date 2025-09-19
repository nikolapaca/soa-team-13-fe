import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter} from '@angular/core';
import { KeyPoint } from '../model/keyPoint.model';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-key-point-card',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './key-point-card.component.html',
  styleUrl: './key-point-card.component.css'
})
export class KeyPointCardComponent {

  @Input({ required: true}) tourId!: number;
  @Input({ required: true }) keyPoint!: KeyPoint;
  @Input() status!: number;

  @Output() delete = new EventEmitter<number>();

  imgLoaded = false;
  imgError  = false;
  readonly placeholder = 'assets/placeholder.jpg';

  constructor(private service: TourService, private router: Router) { }

  ngOnInit(){

  }

  onEditClick(){
    this.router.navigate(['/key-point', this.tourId, this.keyPoint.id, 'update']);
  }


  onDeleteClick(){
    this.service.deleteKeyPoint(this.keyPoint.id!).subscribe({
        next : (result) =>{
          console.log("OVAKO IZGLEDA IZMENJENA TURA: ", result);
          this.delete.emit(this.keyPoint.id);
        }
      })
  }

  get imgSrc(): string {
    return this.imgError || !this.keyPoint?.image ? this.placeholder : this.keyPoint.image;
  }

  onImgLoad() { this.imgLoaded = true; }
  onImgError() { this.imgError = true; }

}
