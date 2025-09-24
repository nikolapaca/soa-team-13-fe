import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourExecution } from '../../../models/tour-execution.model';
import { TourExecutionService } from '../tour-execution.service';
import { KeyPointsStatus } from '../../../models/keypoint-status.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MapComponent } from '../../../shared/map-component/map-component';

@Component({
  selector: 'app-tour-execution',
  templateUrl: './tour-execution.html',
  styleUrls: ['./tour-execution.css'],
  imports: [CommonModule, DatePipe, MapComponent]
})
export class TourExecutionComponent implements OnInit {
  execution!: TourExecution;
  completionPercentage: number = 0;

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
      .subscribe(updated => this.execution = updated);
      alert("you completed tour execution");
      this.router.navigate(['/published-tours']);
  }

  abandon() {
    this.tourExecutionService.abandon(this.execution.userId)
      .subscribe(updated => this.execution = updated);
      alert("you abandoned tour execution");
      this.router.navigate(['/published-tours']);

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

}
