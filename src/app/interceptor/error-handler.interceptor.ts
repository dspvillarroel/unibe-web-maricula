import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {MessageService} from 'primeng/api';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    let errorMesage = "";

    if (error.status === 0) {
      errorMesage = "El servidor no se encuentra disponible";
    } else if (error.status === 401 || error.status === 403) {
      errorMesage = 'Su sesión a caducado, inicie sesión nuevamente.';
    } else {
      errorMesage = error?.error.mensaje ?? "Ocurrió un error inesperado";
    }

    messageService.clear();

    messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMesage,
      life: 5000
    });

    return throwError(() => errorMesage);
  }));
};
