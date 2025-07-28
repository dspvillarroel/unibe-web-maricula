export interface StudentInfoResponse {
  codUsuario: number;
  codEstudiante: number;
  apellidos: string;
  correo: string;
  usuario: string;
  nombres: string;
  habilitado: boolean;
  fechaRegistro: Date;
  activo: boolean;
  cedula: string;
  carrera: string;
  codCarrera: number;
  codGenero: string;
  nivel: number;
  modalidad: string;
  codModalidad: number;
  homologacion: boolean;
  lugarHomologacion: string;
  fechaNacimiento: Date;
}
