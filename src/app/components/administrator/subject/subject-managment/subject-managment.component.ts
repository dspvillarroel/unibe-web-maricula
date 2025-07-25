import {Component, computed, DestroyRef, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {Table, TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Toolbar} from 'primeng/toolbar';
import {Tooltip} from 'primeng/tooltip';
import {SubjectInfoResponse} from '@app/model/subject/subject-info-response';
import {SubjectCreateComponent} from '@app/components/administrator/subject/subject-create/subject-create.component';
import {SubjectEditComponent} from '@app/components/administrator/subject/subject-edit/subject-edit.component';
import {BehaviorSubject} from 'rxjs';
import {SubjectFilterComponent} from '@app/components/administrator/subject/subject-filter/subject-filter.component';
import {AdministratorService} from '@app/service/administrator.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {SubjectList} from '@app/model/subject/subject-list';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-subject-managment',
  imports: [
    Button,
    NgForOf,
    NgIf,
    Skeleton,
    TableModule,
    Toast,
    Toolbar,
    Tooltip,
    SubjectCreateComponent,
    SubjectEditComponent,
    SubjectFilterComponent,
    ConfirmDialog
  ],
  standalone: true,
  templateUrl: './subject-managment.component.html',
  styleUrl: './subject-managment.component.scss',
  providers: [ConfirmationService],
})
export class SubjectManagmentComponent {
  @ViewChild('subjectTable') subjectTable!: Table;

  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  protected isCreatedSubject: WritableSignal<boolean> = signal(false);
  protected isEditingSubject: WritableSignal<boolean> = signal(false);

  protected subjects: SubjectInfoResponse[] = [];
  protected showDialog = computed(() => this.isCreatedSubject());
  protected showDialogEdit = computed(() => this.isEditingSubject());
  protected subjectToEdit!: SubjectInfoResponse;
  protected maxLevel!: number;
  protected totalSubjects = 0;
  protected subjectsPerPage = 10;
  protected loadingSubjects = new BehaviorSubject<boolean>(false);
  protected listSubject!: SubjectList;

  protected listSubjects(event: TableLazyLoadEvent) {
    const pageNo = (event.first ?? 0) / this.subjectsPerPage;

    if (this.listSubject) {
      this.maxLevel = this.listSubject.maxLevel;
      this.administratorService.getSubjects(this.listSubject.codCareer, this.listSubject.level, pageNo, this.subjectsPerPage)
        .subscribe(subject => {
          this.subjects = subject.subjects;
          this.totalSubjects = subject.totalSubjects;
        })
    }
  }

  protected createSubject() {
    this.isCreatedSubject.set(true);
  }

  protected editSubject(subject: SubjectInfoResponse) {
    this.subjectToEdit = subject;
    this.isEditingSubject.set(true);
  }

  refreshSubjects() {
    this.subjectTable.reset();
    this.isEditingSubject.set(false);
    this.isCreatedSubject.set(false);
  }

  deleteSubject(event: Event, codSubject: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de eliminar esta asignatura?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
      },
      accept: () => {
        this.administratorService.deleteSubject(codSubject).subscribe(
          () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminado',
              detail: 'Asignatura eliminada correctamente'
            });

            this.refreshSubjects();
          }
        )
      }
    });
  }


  filterSubjects(event: SubjectList) {
    this.listSubject = event;

    this.subjectTable.reset();
  }
}
