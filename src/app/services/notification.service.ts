import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  showNotification(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info' 
  ): void {
    const config = { timeOut: 3000 };

    switch (type) {
      case 'success':
        this.toastr.success(message, '', config);
        break;
      case 'error':
        this.toastr.error(message, '', config);
        break;
      case 'warning':  
        this.toastr.warning(message, '', config);
        break;
      case 'info':
      default:
        this.toastr.info(message, '', config);
        break;
    }
  }
}
