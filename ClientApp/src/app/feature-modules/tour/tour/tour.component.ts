import { Component } from '@angular/core';
import { Tour } from '../model/tour.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../../../shared/map-component/map-component';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../tour.service';
import { KeyPointCardComponent } from '../key-point-card/key-point-card.component';
import { TourReview } from '../model/tourReview.model';
import { jwtDecode } from 'jwt-decode';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { TourExecution } from '../../../models/tour-execution.model';

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
  token: any;

  constructor(private router: Router, private route: ActivatedRoute, private service: TourService, 
              private exeService: TourExecutionService) { }

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
    this.router.navigate(['/key-point', this.tourId, 'create']);
  }

  onDeleteKeyPoint(id: number) {
    this.service.getTourById(this.tourId).subscribe({
        next : (result) =>{
          this.tour = result;
          this.tour.length = 0;
          this.tour.durations[0].duration = 0
            if(!this.tour?.reviews){
              this.tour!.reviews = [];
            }
            this.service.updateTour(this.tourId, this.tour).subscribe({
              next : (result) =>{
                this.tour=result;
              }
            })
        }
      })
  }
  onDistanceAndTime({distance, time}: {distance: number, time: number}){
    if(this.tour?.length !== distance){
      this.tour!.length = distance;
      if(this.tour?.durations.length !== 0){
        this.tour!.durations[0].duration = time;
      }
      else{
        var tourDuration = {
          id: 0,
          duration: time,
          transportType: 0
        };
        this.tour!.durations = []
        this.tour!.durations.push(tourDuration);
      }
      if(!this.tour?.reviews){
        this.tour!.reviews = [];
      }
        this.service.updateTour(this.tour!.id, this.tour!).subscribe({
          next : (result) =>{
            this.tour=result;
          }
        })
      }
    
  }

  hasTourDuration(t: Tour): number{
    if(t.durations === undefined)
      return 0;
    if(t.durations[0] === undefined)
      return 0;
    return t.durations[0].duration;
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
  onPublish(){
    if(!this.tour?.reviews){
      this.tour!.reviews = [];
    }
    this.service.publishTour(this.tour!.id, this.tour!).subscribe({
        next : (result) =>{
          this.tour = result;
        },
        error : (err) => {
          alert("Tura nije ispunila uslove za objavljivanje. 1. Tura sadrži osnovne podatke (naziv ture, opis, težinu i tagove), 2. Tura sadrži bar dve ključne tačke. 3. Definisano je bar jedno vreme potrebno da se obiđe tura u zavisnosti od prevoza")
        }
      })
  }
  onArchive(){
    if(!this.tour?.reviews){
      this.tour!.reviews = [];
    }
    this.service.archiveTour(this.tour!.id, this.tour!).subscribe({
      next : (result) =>{
        this.tour = result;
      }
    })
  }
  onReactivate(){
    if(!this.tour?.reviews){
      this.tour!.reviews = [];
    }
    this.service.reactivateTour(this.tour!.id, this.tour!).subscribe({
      next : (result) =>{
        this.tour = result;
      }
    })
  }

    startTour(): void {
    this.token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
    var decodedToken = jwtDecode(this.token);
    var userId = decodedToken['sub']!

    const dto = {
      tourId: this.tourId,
      userId: userId
    };
    this.exeService.create(dto).subscribe({
      next: (execution: TourExecution) => {
        this.router.navigate(['/tour-execution', execution.id]);
      },
      error: (err) => {
        console.error('Error starting tour:', err);
      }
    });
  }
}
