import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {StudentLevelResponse} from '@app/model/student/student-level-response';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrlMatricula;
  private readonly matriculaContext = environment.matriculaContext;

  getCurrentLevel() {
    return this.http.get<StudentLevelResponse[]>(`${this.baseUrl}${this.matriculaContext}/api/v1/students`);
  }
}
