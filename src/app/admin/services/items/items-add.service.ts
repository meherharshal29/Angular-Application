import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsAddService {

  private url = "http://localhost:3000/Vegetables";

  constructor(private http: HttpClient) { }

  // 🔹 Get all items
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // 🔹 Add new item
  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.url, item);
  }

  // 🔹 Update/Edit item by id
  updateItem(id: number, updatedItem: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, updatedItem);
  }

  // 🔹 Delete item by id
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
