import {StudentInfoResponse} from '@app/model/administrator/response/student-info-response';

export interface StudentResponse {
  students:      StudentInfoResponse[];
  totalStudents: number;
}
