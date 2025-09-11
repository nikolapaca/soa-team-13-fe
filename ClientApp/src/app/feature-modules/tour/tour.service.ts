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
}
