import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultOptions = {
    timeOut: 5000,
    progressBar: true,
    closeButton: true,
    positionClass: 'toast-bottom-right',
  };

  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Sucesso') {
    this.toastr.success(message, title, this.defaultOptions);
  }

  error(message: string, title: string = 'Erro') {
    this.toastr.error(message, title, this.defaultOptions);
  }

  info(message: string, title: string = 'Informação') {
    this.toastr.info(message, title, this.defaultOptions);
  }

  warning(message: string, title: string = 'Atenção') {
    this.toastr.warning(message, title, this.defaultOptions);
  }
}
