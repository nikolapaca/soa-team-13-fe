import { ChangeDetectorRef, Component } from '@angular/core';
import { Tour } from '../model/tour.model';
import { jwtDecode } from 'jwt-decode';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css'
})
export class ToursComponent {

  tours: Tour[]=[];
  shouldRenderTourForm: boolean=false;
  addTour: boolean = false;
  accountId : string = "";
  token: any;
  constructor(private service: TourService, private router: Router, private http: HttpClient, private cdRef: ChangeDetectorRef){}

  ngOnInit(): void{
    this.getTours();
  }

  getTours(): void {
    this.service.getForAuthor().subscribe({
      next: (res) => {
        this.tours = res;
        this.cdRef.detectChanges()
      }
    })
  }

    getStatus(id: number) : string {
      if(id === 0)
        return "Draft";
      else if(id === 1)
        return "Published";
      else
        return "Archived";
  }
    getDifficulty(diff: number): string{
      if(diff === 0)
        return "Easy";
      else if(diff === 1)
        return "Medium";
      else if(diff === 2)
        return "Hard";
      else if(diff === 3)
        return "Hell";
      else
        return "Not set"
  }

  onAddClicked() {
    this.router.navigate(["add-tour"]);
  }

  onCardClick(tourId: number): void{
    this.router.navigate(['/tour', tourId]);
  }

  hasTourDuration(t: Tour): number{
    if(t.durations === undefined)
      return 0;
    if(t.durations[0] === undefined)
      return 0;
    return t.durations[0].duration;
  }
}
