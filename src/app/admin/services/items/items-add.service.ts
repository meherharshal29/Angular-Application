import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsAddService {
  private url = 'http://localhost:8080/api/items';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // ✅ Add new item (multipart form-data)
  addItem(item: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<any>(this.url, formData);
  }

  // ✅ Update item (multipart form-data)
  updateItem(id: number, item: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(item)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.put<any>(`${this.url}/${id}`, formData);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
