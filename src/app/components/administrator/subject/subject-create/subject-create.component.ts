import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {Fieldset} from 'primeng/fieldset';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {KeyFilter} from 'primeng/keyfilter';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Toast} from 'primeng/toast';
import {AdministratorService} from '@app/service/administrator.service';
import {MessageService} from 'primeng/api';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {finalize} from 'rxjs';
import {Select} from 'primeng/select';
import {Tooltip} from 'primeng/tooltip';
import {SubjectRequest} from '@app/model/subject/subject-request';

@Component({
  selector: 'app-subject-create',
  imports: [
    Button,
    Dialog,
    DropdownModule,
    Fieldset,
    InputNumber,
    InputText,
    KeyFilter,
    ReactiveFormsModule,
    Toast,
    Select,
    Tooltip
  ],
  standalone: true,
  templateUrl: './subject-create.component.html',
  styleUrl: './subject-create.component.scss'
})
export class SubjectCreateComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private fb = inject(NonNullableFormBuilder);
  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);

  @Input() showDialog = true;
  @Output() onClose = new EventEmitter<void>();

  protected careersAvailable$ = toSignal(this.administratorService.getCareer());
  protected subjectTypes$ = toSignal(this.administratorService.getSubjectTypes());

  protected isCreatingSubject = false;
  protected formSubject!: FormGroup;
  protected maxLevel = 1;
  protected isNotCareerSelected = true;

  ngOnInit() {
    this.formSubject = this.fb.group({
      codSubject: ['', Validators.required],
      subject: [null, Validators.required],
      hours: [null, Validators.required],
      codSubjectType: [null, Validators.required],
      codMoodle: [null, Validators.required],
      career: [null, Validators.required],
      level: [{value: 1, disabled: this.isNotCareerSelected}, Validators.required],
      credits: [0]
    });
  }

  registerSubject() {
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
      codCarrera: this.formSubject.value.career,
      codTipoAsignatura: this.formSubject.value.codSubjectType,
      codMoodle: this.formSubject.value.codMoodle,
      creditos: this.formSubject.value.credits ?? 0
    }

    this.isCreatingSubject = true;

    this.administratorService.createSubject(subjectRequest)
      .pipe(finalize(() => this.isCreatingSubject = false), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'La asignatura se creó correctamente'
        });
        this.closeDialog();
      });
  }

  changeCareer(event: DropdownChangeEvent) {
    const codCareer = event.value as number;
    const careerSelected = this.careersAvailable$()?.find(c => c.codCarrera === codCareer)!;

    this.maxLevel = careerSelected.niveles;
    this.isNotCareerSelected = false;

    this.formSubject.get('level')?.enable();
    this.formSubject.get('level')?.reset();
  }

  closeDialog() {
    this.onClose.emit();
  }
}
