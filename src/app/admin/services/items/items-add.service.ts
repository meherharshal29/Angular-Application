import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemsAddService {
  private url = 'http://localhost:8080/api/items';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(catchError(this.handleError));
  }

  getItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  addItem(item: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    if (imageFile) formData.append('image', imageFile);
    return this.http.post<any>(this.url, formData).pipe(catchError(this.handleError));
  }

  updateItem(id: number, item: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    if (imageFile) formData.append('image', imageFile);
    return this.http.put<any>(`${this.url}/${id}`, formData).pipe(catchError(this.handleError));
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let msg = 'An unknown error occurred';
    if (error.status === 400) msg = 'Invalid data';
    else if (error.status === 404) msg = 'Item not found';
    else if (error.status === 500) msg = 'Server error';
    return throwError(() => new Error(msg));
  }
}
