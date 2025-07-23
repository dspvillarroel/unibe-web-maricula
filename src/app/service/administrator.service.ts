import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {StudentResponse} from '@app/model/administrator/response/student-response';
import {GenreResponse} from '@app/model/genre/genre-response';
import {CarreraInfoResponse} from '@app/model/career/carrera-info-response';
import {StudentRequest} from '@app/model/administrator/request/student-request';
import {StudentRegisterRequest} from '@app/model/student/student-register-request';
import {CodUsuarioRequest} from '@app/model/administrator/request/cod-usuario-request';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  private readonly apiBaseSecurity = environment.baseUrl;
  private readonly apiBaseMatricula = environment.baseUrlMatricula;
  private readonly matriculaContext = environment.matriculaContext;
  private readonly securityContext = environment.securityContext;

  private http = inject(HttpClient);

  getStudents(studentRequest: StudentRequest) {
    const url = `${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/students`;
    return this.http.post<StudentResponse>(url, studentRequest);
  }

  exportStudents(codCareer: number, level: number) {
    const url = `${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/students/csv/carrera/${codCareer}/nivel/${level}`;
    return this.http.get(url, {responseType: 'blob'});
  }

  getGenres() {
    return this.http.get<GenreResponse[]>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/genres`);
  }

  getCareer() {
    return this.http.get<CarreraInfoResponse[]>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/careers`);
  }

  registerStudent(studentRequest: StudentRegisterRequest) {
    return this.http.post<void>(`${this.apiBaseSecurity}${this.securityContext}/api/v1/students`, studentRequest);
  }

  resendEmail(codUsuarioRequest: CodUsuarioRequest) {
    return this.http.post<void>(`${this.apiBaseSecurity}${this.securityContext}/api/v1/administrators/email`, codUsuarioRequest);
  }

  changeEnabled(codUsuarioRequest: CodUsuarioRequest) {
    return this.http.put<void>(`${this.apiBaseSecurity}${this.securityContext}/api/v1/administrators/enable-status`, codUsuarioRequest);
  }
}
