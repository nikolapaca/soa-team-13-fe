import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour } from './model/tour.model';
import { KeyPoint } from './model/keyPoint.model';
import { jwtDecode } from 'jwt-decode';
import { TourReview } from './model/tourReview.model';

@Injectable({
  providedIn: 'root'
})

export class TourService{

  token: any;
    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
    }

  addKeyPoint(keyPoint: KeyPoint): Observable<KeyPoint> {
    return this.http.post<KeyPoint>('http://localhost:8070/tours/key-points/', keyPoint, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  getTourById(tourId: number): Observable<Tour> {
    return this.http.get<Tour>('http://localhost:8070/tours/' + tourId, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  getKeyPoint(keyPointId: number): Observable<KeyPoint> {
    return this.http.get<KeyPoint>('http://localhost:8070/tours/key-points/' + keyPointId,  {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  updateTour(tourId: number, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>('http://localhost:8070/tours/' + tourId, tour, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  deleteKeyPoint(keyPointId: number) {
    return this.http.delete<void>('http://localhost:8070/tours/key-points/' + keyPointId, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  publishTour(tourId: number, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>('http://localhost:8070/tours/publish/' + tourId, tour, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  archiveTour(tourId: number, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>('http://localhost:8070/tours/archive/' + tourId, tour, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  reactivateTour(tourId: number, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>('http://localhost:8070/tours/reactivate/' + tourId, tour, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  getPublished(): Observable<Tour[]> {
    return this.http.get<Tour[]>('http://localhost:8070/tours/published/', {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  getForAuthor(): Observable<Tour[]>{
    var decodedToken = jwtDecode(this.token);
    var accountId = decodedToken['sub']!
    return this.http.get<Tour[]>("http://localhost:8070/tours/author/"+accountId, {headers: {'Authorization': `Bearer ${this.token}`}})
  }

  create(tour: Tour): Observable<Tour> {
    var decodedToken = jwtDecode(this.token);
    var accountId = decodedToken['sub']!
    tour.authorId = accountId;
    return this.http.post<Tour>('http://localhost:8070/tours/', tour, {headers: {'Authorization': `Bearer ${this.token}`}});
  }

  getReviewsByTourId(tourId: number): Observable<TourReview[]> {
    return this.http.get<TourReview[]>(`http://localhost:8084/tourReview/tour/${tourId}`);
  }
}
