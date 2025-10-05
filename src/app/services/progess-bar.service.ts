import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private progressSubject = new BehaviorSubject<number>(0);
  private showProgressSubject = new BehaviorSubject<boolean>(false);

  progress$: Observable<number> = this.progressSubject.asObservable();
  showProgress$: Observable<boolean> = this.showProgressSubject.asObservable();

  simulateProgress(callback: () => Promise<boolean>): Promise<boolean> {
    return new Promise((resolve) => {
      this.showProgressSubject.next(true);
      this.progressSubject.next(0);

      const interval = setInterval(() => {
        const current = this.progressSubject.value + 10;
        this.progressSubject.next(current);

        if (current >= 90) {
          clearInterval(interval);
          callback().then((success) => {
            this.progressSubject.next(success ? 100 : 0);
            setTimeout(() => {
              this.showProgressSubject.next(false);
            }, 1000);
            resolve(success);
          });
        }
      }, 300);
    });
  }
}