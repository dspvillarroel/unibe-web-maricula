import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {JwtPayload} from '@app/model/security/response/jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getRoles() {
    try {
      return jwtDecode<JwtPayload>(localStorage.getItem('token')!).roles;
    } catch (error) {
      return null;
    }
  }

  hasRole(roles: string[]): boolean {
    const userRoles = this.getRoles();

    if (!userRoles) {
      return false;
    }

    return roles.some(role => userRoles.includes(role));
  }
}
