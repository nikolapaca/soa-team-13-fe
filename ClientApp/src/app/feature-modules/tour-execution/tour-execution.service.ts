import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourExecution } from '../../models/tour-execution.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {
  private apiUrl = 'http://localhost:8084/tourExecutions';

  constructor(private http: HttpClient) { }

  create(tourExecutionDto: any): Observable<TourExecution> {
    return this.http.post<TourExecution>(`http://localhost:8084/tourExecutions`, tourExecutionDto);
  }

  getById(id: number): Observable<TourExecution> {
    return this.http.get<TourExecution>(`http://localhost:8084/tourExecutions/${id}`);
  }

  updatePosition(executionId: number, longitude: number, latitude: number): Observable<TourExecution> {
    return this.http.put<TourExecution>(`http://localhost:8084/tourExecutions/update/${executionId}/${longitude}/${latitude}`, {});
  }

  getCompletionPercentage(executionId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${executionId}/completion-percentage`);
  }

  complete(userId: string): Observable<TourExecution> {
    return this.http.put<TourExecution>(`${this.apiUrl}/complete/${userId}`, {});
  }

  abandon(userId: string): Observable<TourExecution> {
    return this.http.put<TourExecution>(`${this.apiUrl}/abandon/${userId}`, {});
  }

  createReview(reviewData: any): Observable<any> {
    const body = {
      ...reviewData
    };

    return this.http.post('/tourReview', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


}
