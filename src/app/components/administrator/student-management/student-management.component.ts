import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {AdministratorService} from '@app/service/administrator.service';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Skeleton} from 'primeng/skeleton';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Toolbar} from 'primeng/toolbar';
import {UtilConst} from '@app/const/util-const';
import {BehaviorSubject, finalize, Observable, of} from 'rxjs';
import {StudentResponse} from '@app/model/administrator/response/student-response';
import {PaginationConst} from '@app/const/paginator-const';
import {StudentRequest} from '@app/model/administrator/request/student-request';
import {StudentCreateComponent} from '@app/components/administrator/student-create/student-create.component';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-student-management',
  imports: [
    Button,
    Tooltip,
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgForOf,
    Skeleton,
    TableModule,
    Tag,
    Toolbar,
    StudentCreateComponent,
    NgIf
  ],
  standalone: true,
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss',
  providers: [MessageService]
})
export class StudentManagementComponent {
  private administratorService = inject(AdministratorService);

  protected readonly studentsPerPage = PaginationConst.PAGE_SIZE_DEFAULT;
  protected loadingStudents = new BehaviorSubject<boolean>(false);
  protected isCreatedStudent: WritableSignal<boolean> = signal(false);
  protected getStudentResponse$: Observable<StudentResponse> = of();
  showDialog = computed(() => this.isCreatedStudent());

  protected exportUser() {
    this.administratorService.exportStudents().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'usuarios.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  protected getStudents(event: TableLazyLoadEvent) {
    const pageNo = (event.first ?? 0) / this.studentsPerPage;

    const studentRequest: StudentRequest = {
      pageNo: pageNo,
      pageSize: this.studentsPerPage
    }

    setTimeout(() => this.loadingStudents.next(true));
    this.getStudentResponse$ = this.administratorService.getStudents(studentRequest)
      .pipe(finalize(() => this.loadingStudents.next(false)));
  }

  createStudent() {
    this.isCreatedStudent.set(true);
  }

  protected readonly UtilConst = UtilConst;
}
