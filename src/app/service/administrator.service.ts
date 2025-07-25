import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {StudentResponse} from '@app/model/administrator/response/student-response';
import {GenreResponse} from '@app/model/genre/genre-response';
import {CarreraInfoResponse} from '@app/model/career/carrera-info-response';
import {StudentRequest} from '@app/model/administrator/request/student-request';
import {StudentRegisterRequest} from '@app/model/student/student-register-request';
import {CodUsuarioRequest} from '@app/model/administrator/request/cod-usuario-request';
import {CarreraPageResponse} from '@app/model/career/carrera-page-response';
import {ModalityResponse} from '@app/model/modality/modality-response';
import {CareerRequest} from '@app/model/career/career-request';
import {SubjectResponse} from '@app/model/subject/subject-response';
import {SubjectTypeResponse} from '@app/model/subject-type/subject-type-response';
import {SubjectRequest} from '@app/model/subject/subject-request';

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

  getModalities() {
    return this.http.get<ModalityResponse[]>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/modalities`);
  }

  registerStudent(studentRequest: StudentRegisterRequest) {
    return this.http.post<void>(`${this.apiBaseSecurity}${this.securityContext}/api/v1/students`, studentRequest);
  }

  updateStudent(studentRequest: StudentRegisterRequest, codUsuario: number) {
    return this.http.put<void>(`${this.apiBaseSecurity}${this.securityContext}/api/v1/students/${codUsuario}`, studentRequest);
  }

  resendEmail(codUsuarioRequest: CodUsuarioRequest) {
    return this.http.post<void>(`${this.apiBaseSecurity}${this.securityContext}/api/v1/administrators/email`, codUsuarioRequest);
  }

  changeEnabled(codUsuarioRequest: CodUsuarioRequest) {
    return this.http.put<void>(`${this.apiBaseSecurity}${this.securityContext}/api/v1/administrators/enable-status`, codUsuarioRequest);
  }

  getCareersPage(pageNo: number, pageSize: number) {
    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);

    return this.http.get<CarreraPageResponse>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/careers-pagination`, {params});
  }

  createCareer(careerRequest: CareerRequest) {
    return this.http.post<void>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/career`, careerRequest);
  }

  updateCareer(careerRequest: CareerRequest, codCareer: number) {
    return this.http.put<void>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/career/${codCareer}`, careerRequest);
  }

  getSubjects(codCareer: number, level: number, pageNo: number, pageSize: number) {
    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);

    return this.http.get<SubjectResponse>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/subjects/${codCareer}/nivel/${level}`, {params});
  }

  getSubjectTypes() {
    return this.http.get<SubjectTypeResponse[]>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/subject-type`);
  }

  createSubject(subjectRequest: SubjectRequest) {
    return this.http.post<void>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/subject`, subjectRequest);
  }

  updateSubject(codSubject: string, subjectRequest: SubjectRequest) {
    return this.http.put<void>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/subject/${codSubject}`, subjectRequest);
  }

  deleteSubject(codSubject: string) {
    return this.http.delete<void>(`${this.apiBaseMatricula}${this.matriculaContext}/api/v1/administrators/subject/${codSubject}`);
  }
}
