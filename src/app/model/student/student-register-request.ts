import {UserInfo} from '@app/model/user/user-info';

export interface StudentRegisterRequest {
  nombre: string;
  apellido: string;
  genero: string;
  carrera: number;
  nivel: number;
  modalidad: number;
  fechaNacimiento: Date;
  homologacion: boolean;
  lugarHomologacion: string;
  aceptaUsoDatos: boolean;
  asignaturasHomologacion: string[];
  usuario: UserInfo;
}
