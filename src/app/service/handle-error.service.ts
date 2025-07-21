import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {
  handleError(mensaje?: string) {
    return (error: HttpErrorResponse) => {
      if (error.status === 0) {
        return throwError(() => new Error("No se pudo conectar con el servidor"));
      }
      const mensajeError = error.error.message ?? mensaje ?? "Ocurrió un error en el servidor";

      return throwError(() => new Error(mensajeError));
    }
  }
}
