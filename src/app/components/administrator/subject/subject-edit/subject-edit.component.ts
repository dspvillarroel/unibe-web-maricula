import {Component, DestroyRef, EventEmitter, inject, input, Input, OnInit, Output} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdministratorService} from '@app/service/administrator.service';
import {MessageService} from 'primeng/api';
import {toSignal} from '@angular/core/rxjs-interop';
import {SubjectInfoResponse} from '@app/model/subject/subject-info-response';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {Fieldset} from "primeng/fieldset";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {KeyFilter} from "primeng/keyfilter";
import {Select} from "primeng/select";
import {Toast} from "primeng/toast";
import {Tooltip} from "primeng/tooltip";
import {SubjectRequest} from '@app/model/subject/subject-request';

@Component({
  selector: 'app-subject-edit',
  imports: [
    Button,
    Dialog,
    DropdownModule,
    Fieldset,
    InputNumber,
    InputText,
    KeyFilter,
    ReactiveFormsModule,
    Select,
    Toast,
    Tooltip
  ],
  standalone: true,
  templateUrl: './subject-edit.component.html',
  styleUrl: './subject-edit.component.scss'
})
export class SubjectEditComponent implements OnInit {
  @Input() showDialog = true;
  @Output() onClose = new EventEmitter<void>();

  private destroyRef = inject(DestroyRef);
  private fb = inject(NonNullableFormBuilder);
  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);
  protected formSubject!: FormGroup;
  protected isCreatingSubject = false;
  protected originalDataForm: any;

  subjectToEdit = input.required<SubjectInfoResponse>();
  maxLevel = input.required<number>();
  protected subjectTypes$ = toSignal(this.administratorService.getSubjectTypes());


  ngOnInit() {
    const subject = this.subjectToEdit();

    this.formSubject = this.fb.group({
      codSubject: [subject.codAsignatura, Validators.required],
      subject: [subject.descripcion, Validators.required],
      hours: [subject.horas, Validators.required],
      codSubjectType: [subject.codTipoAsignatura, Validators.required],
      codMoodle: [subject.codMoodle, Validators.required],
      career: [{value: subject.carrera, disabled: true}, Validators.required],
      level: [subject.nivel, Validators.required],
    });

    this.originalDataForm = this.formSubject.getRawValue();
  }


  saveSubject() {
    if (this.hasFormChanged()) {
      this.messageService.clear();
      this.messageService.add({severity: 'info', summary: 'Información', detail: 'No se cambió ningun valor'});
      return;
    }

    if (this.formSubject.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Validar los campos correctamente'});
      this.formSubject.markAllAsTouched();
      return;
    }

    const subjectRequest: SubjectRequest = {
      codAsignatura: this.formSubject.value.codSubject,
      descripcion: this.formSubject.value.subject,
      horas: this.formSubject.value.hours,
      nivel: this.formSubject.value.level,
      codCarrera: this.subjectToEdit().codCarrera,
      codTipoAsignatura: this.formSubject.value.codSubjectType,
      codMoodle: this.formSubject.value.codMoodle,
    }

    this.administratorService.updateSubject(this.subjectToEdit().codAsignatura, subjectRequest)
      .subscribe(() => {
        this.messageService.add({severity: 'success', summary: 'Exitoso', detail: 'Se actualizó la asignatura correctamente'});
        this.closeDialog();
      })
  }

  hasFormChanged() {
    const currentValue = this.formSubject.getRawValue();
    return JSON.stringify(currentValue) === JSON.stringify(this.originalDataForm);
  }

  closeDialog() {
    this.onClose.emit();
  }
}
