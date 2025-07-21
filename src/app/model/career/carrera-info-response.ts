import {ModalityInfoResponse} from '@app/model/modality/modality-info-response';

export interface CarreraInfoResponse {
  codCarrera:  number;
  carrera:     string;
  niveles:     number;
  modalidades: ModalityInfoResponse[];
}
