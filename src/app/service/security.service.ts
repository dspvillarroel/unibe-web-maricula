import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {LoginRequest} from '@app/model/security/request/login-request';
import {LoginResponse} from '@app/model/security/response/login-response';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  private readonly securityContext = environment.securityContext;

  login(loginRequest: LoginRequest) {
    const url = `${this.baseUrl}${this.securityContext}/api/v1/auth/login`;
    return this.http.post<LoginResponse>(url, loginRequest);
  }
}
