import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour } from './model/tour.model';
import { KeyPoint } from './model/keyPoint.model';

@Injectable({
  providedIn: 'root'
})

export class TourService{

    constructor(private http: HttpClient) { }

  addKeyPoint(keyPoint: KeyPoint): Observable<KeyPoint> {
    return this.http.post<KeyPoint>('http://localhost:8084/key-points/', keyPoint)
  }

  getTourById(tourId: number): Observable<Tour> {
    return this.http.get<Tour>('http://localhost:8084/tours/' + tourId)
  }

  getKeyPoint(keyPointId: number): Observable<KeyPoint> {
    return this.http.get<KeyPoint>('http://localhost:8084/key-points/' + keyPointId)
  }

  updateTour(tourId: number, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>('http://localhost:8084/tours/' + tourId, tour)
  }

  deleteKeyPoint(keyPointId: number) {
    return this.http.delete<void>('http://localhost:8084/key-points/' + keyPointId)
  }
}
