import {SubjectInfoResponse} from '@app/model/subject/subject-info-response';

export interface SubjectResponse {
  subjects: SubjectInfoResponse[];
  totalSubjects: number;
}
