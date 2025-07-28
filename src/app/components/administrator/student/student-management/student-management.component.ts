import {Component, computed, DestroyRef, inject, input, signal, ViewChild, WritableSignal} from '@angular/core';
import {AdministratorService} from '@app/service/administrator.service';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Skeleton} from 'primeng/skeleton';
import {Table, TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Toolbar} from 'primeng/toolbar';
import {UtilConst} from '@app/const/util-const';
import {BehaviorSubject, finalize, map, tap} from 'rxjs';
import {PaginationConst} from '@app/const/paginator-const';
import {StudentRequest} from '@app/model/administrator/request/student-request';
import {StudentCreateComponent} from '@app/components/administrator/student/student-create/student-create.component';
import {MessageService} from 'primeng/api';
import {CodUsuarioRequest} from '@app/model/administrator/request/cod-usuario-request';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Toast} from 'primeng/toast';
import {StudentInfoResponse} from '@app/model/administrator/response/student-info-response';
import {StudentFilterComponent} from '@app/components/administrator/student/student-filter/student-filter.component';
import {StudentList} from '@app/model/student/student-list';
import {StudentEditComponent} from '@app/components/administrator/student/student-edit/student-edit.component';

@Component({
  selector: 'app-student-management',
  imports: [
    Button,
    Tooltip,
    DatePipe,
    FormsModule,
    NgForOf,
    Skeleton,
    TableModule,
    Tag,
    Toolbar,
    StudentCreateComponent,
    NgIf,
    Toast,
    StudentFilterComponent,
    StudentEditComponent
  ],
  standalone: true,
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss',
  providers: [MessageService]
})
export class StudentManagementComponent {
  @ViewChild('studentsTable') studentsTable!: Table;

  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  protected students: StudentInfoResponse[] = [];
  protected totalStudents: number = 0;

  protected readonly studentsPerPage = PaginationConst.PAGE_SIZE_DEFAULT;
  protected loadingStudents = new BehaviorSubject<boolean>(false);
  protected loadingOperation = new BehaviorSubject<boolean>(false);
  protected isCreatedStudent: WritableSignal<boolean> = signal(false);
  protected isEditingStudent: WritableSignal<boolean> = signal(false);
  protected listStudent!: StudentList;
  protected showDialog = computed(() => this.isCreatedStudent());
  protected showDialogEdit = computed(() => this.isEditingStudent());
  protected studentToEdit!: StudentInfoResponse;

  protected exportUser() {
    this.administratorService.exportStudents(this.listStudent.codCareer, this.listStudent.level).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'usuarios.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  protected exportApprovalUser(codStudent: number) {
    this.administratorService.exportApprovalStudent(codStudent).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'estudiante_homologado.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  protected getStudents(event: TableLazyLoadEvent) {
    if (this.listStudent) {
      const pageNo = (event.first ?? 0) / this.studentsPerPage;

      const studentRequest: StudentRequest = {
        codCarrera: this.listStudent.codCareer,
        nivel: this.listStudent.level,
        pageNo: pageNo,
        pageSize: this.studentsPerPage
      }

      setTimeout(() => this.loadingStudents.next(true));

      this.administratorService.getStudents(studentRequest)
        .pipe(
          finalize(() => this.loadingStudents.next(false)),
          tap((response) => {
            this.students = response.students;
            this.totalStudents = response.totalStudents;
          })
        )
        .subscribe();
    }
  }

  protected listStudents(event: StudentList) {
    this.listStudent = event;

    this.studentsTable.reset();
  }

  protected refreshStudents(codUsuario: number) {
    this.students = this.students.map(s =>
      s.codUsuario === codUsuario ? { ...s, habilitado: !s.habilitado } : s
    );
  }

  protected resendEmail(codUsuario: number) {
    const codUsuarioRequest: CodUsuarioRequest = {
      codUsuario: codUsuario,
    }

    this.loadingOperation.next(true);
    this.administratorService.resendEmail(codUsuarioRequest)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loadingOperation.next(false)))
      .subscribe({
        next: () => {
          this.messageService.add({severity: 'success', detail: 'Correo reenviado correctamente', summary: 'Exitoso'});
        }
      })
  }

  protected changeStatusEnabled(codUsuario: number) {
    const codUsuarioRequest: CodUsuarioRequest = {
      codUsuario: codUsuario,
    }

    this.loadingOperation.next(true);
    this.administratorService.changeEnabled(codUsuarioRequest)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loadingOperation.next(false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Estado habilitado cambiado correctamente',
            summary: 'Exitoso'
          });
        }
      });

    this.refreshStudents(codUsuario);
  }

  protected createStudent() {
    this.isCreatedStudent.set(true);
  }

  protected refreshSearch() {
    this.isCreatedStudent.set(false);
    this.isEditingStudent.set(false);
    this.getStudents({first: 0});
  }

  protected editStudent(student: StudentInfoResponse) {
    this.studentToEdit = student;
    this.isEditingStudent.set(true);
  }

  protected readonly UtilConst = UtilConst;
}
