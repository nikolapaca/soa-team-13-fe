import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourExecution } from '../../../models/tour-execution.model';
import { TourExecutionService } from '../tour-execution.service';
import { KeyPointsStatus } from '../../../models/keypoint-status.model';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { MapComponent } from '../../../shared/map-component/map-component';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-tour-execution',
  templateUrl: './tour-execution.html',
  styleUrls: ['./tour-execution.css'],
  imports: [CommonModule, DatePipe, MapComponent, FormsModule]
})
export class TourExecutionComponent implements OnInit {
  execution!: TourExecution;
  completionPercentage: number = 0;

  showReviewModal: boolean = false;
  reviewRating: number = 5;
  reviewComment: string = '';


  constructor(
    private route: ActivatedRoute,
    private tourExecutionService: TourExecutionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const executionId = Number(this.route.snapshot.paramMap.get('id'));

    this.tourExecutionService.getById(executionId).subscribe(ex => {
      this.execution = ex;
      this.loadCompletion();
    });

    setInterval(() => {
      console.log("azuriram koordinate iz localStorage-a");
      if (this.execution?.id) {
        const savedLat = localStorage.getItem('lat');
        const savedLng = localStorage.getItem('long');

        if (savedLat && savedLng) {
          const lat = parseFloat(savedLat);
          const lng = parseFloat(savedLng);

          this.tourExecutionService.updatePosition(this.execution.id, lng, lat)
            .subscribe(updated => {
              this.execution = updated;
              this.loadCompletion();
            });
        }
      }
    }, 10000);

  }

  loadCompletion() {
    this.tourExecutionService.getCompletionPercentage(this.execution.id)
      .subscribe(percent => this.completionPercentage = percent);
  }

  complete() {
    this.tourExecutionService.complete(this.execution.userId)
      .subscribe({
          next: updated => {
            this.execution = updated;
            this.showReviewModal = true; 
          },
          error: err => console.error(err)
        });
  }

    abandon() {
      this.tourExecutionService.abandon(this.execution.userId)
        .subscribe({
          next: updated => {
            this.execution = updated;
            this.showReviewModal = true;
          },
          error: err => console.error(err)
        });
    }

  get completedPoints(): KeyPointsStatus[] {
    return this.execution?.keypointsStatus?.filter(
      kp => new Date(kp.completionTime).getTime() > 0
    ) ?? [];
  }

  get pendingPoints(): KeyPointsStatus[] {
    return this.execution?.keypointsStatus?.filter(
      kp => new Date(kp.completionTime).getTime() <= 0
    ) ?? [];
  }

  
  onCoords(p: { lat: number; lng: number }) {}

  submitReview() {
    const formatDate = (date: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    const review = {
      tourId: Number(this.execution.tourId),
      touristId: this.execution.userId,
      rating: Number(this.reviewRating),
      comment: this.reviewComment,
      tourDate: formatDate(new Date(this.execution.startTime)), 
      creationDate: formatDate(new Date()) 
    };

    console.log("review: ", review);
    this.tourExecutionService.createReview(review)
      .subscribe({
        next: () => {
          this.showReviewModal = false;
        },
        error: err => console.error('Error submitting review', err)
      });
      this.router.navigate(['/published-tours']);

  }

}
