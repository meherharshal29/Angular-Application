import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define Feedback model
export interface Feedback {
  itemId: string; 
  fullName: string; 
  email: string;
  rating: number;
  feedbackText: string;
  createdAt: any; 
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080/api/feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    const payload = { ...feedback, createdAt: new Date(feedback.createdAt).toISOString() };
    return this.http.post<Feedback>(`${this.apiUrl}/add`, payload);
  }

  getFeedbacksByItemId(itemId: string): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/${itemId}`);
  }
}