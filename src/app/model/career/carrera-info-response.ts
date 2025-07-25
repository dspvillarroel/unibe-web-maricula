import {ModalityInfoResponse} from '@app/model/modality/modality-info-response';

export interface CarreraInfoResponse {
  codCarrera: number;
  carrera: string;
  niveles: number;
  ciclo: string;
  modalidades: ModalityInfoResponse[];
}
