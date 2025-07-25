import {CarreraInfoResponse} from '@app/model/career/carrera-info-response';

export interface CarreraPageResponse {
  careers: CarreraInfoResponse[];
  totalCareers: number;
}
