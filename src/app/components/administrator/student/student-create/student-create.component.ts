import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal} from '@angular/core';
import {FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {AdministratorService} from '@app/service/administrator.service';
import {Button} from 'primeng/button';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {InputNumber} from 'primeng/inputnumber';
import {KeyFilter} from 'primeng/keyfilter';
import {Dialog} from 'primeng/dialog';
import {ModalityInfoResponse} from '@app/model/modality/modality-info-response';
import {Fieldset} from 'primeng/fieldset';
import {MessageService} from 'primeng/api';
import {UserInfo} from '@app/model/user/user-info';
import {StudentRegisterRequest} from '@app/model/student/student-register-request';
import {DatePicker} from 'primeng/datepicker';
import {UtilConst} from '@app/const/util-const';
import {finalize} from 'rxjs';
import {SeverityEnum} from '@app/enum/severity-enum';
import {Toast} from 'primeng/toast';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {SelectButton} from 'primeng/selectbutton';
import {Message} from 'primeng/message';
import {Checkbox} from 'primeng/checkbox';
import {PickList} from 'primeng/picklist';
import {MultiSelect, MultiSelectChangeEvent} from 'primeng/multiselect';
import {SubjectApprovalResponse} from '@app/model/subject/subject-approval-response';
import {SubjectApprovalRequest} from '@app/model/subject/subject-approval-request';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-student-create',
  imports: [
    ReactiveFormsModule,
    InputText,
    FormsModule,
    Button,
    DropdownModule,
    InputNumber,
    KeyFilter,
    Dialog,
    Fieldset,
    DatePicker,
    Toast,
    Stepper,
    StepList,
    StepPanels,
    Step,
    StepPanel,
    SelectButton,
    Message,
    Checkbox,
    PickList,
    MultiSelect,
    Select,
  ],
  standalone: true,
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.scss',
  providers: [MessageService, Message]
})
export class StudentCreateComponent implements OnInit {
  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  protected fb = inject(NonNullableFormBuilder);

  @Input() showDialog = true;
  @Output() onClose = new EventEmitter<void>();

  protected genresAvailable$ = toSignal(this.administratorService.getGenres());
  protected careersAvailable$ = toSignal(this.administratorService.getCareer());

  protected formStudent!: FormGroup;
  protected readonly UtilConst = UtilConst;
  protected modalities: ModalityInfoResponse[] = [];
  protected approvalSubjects: SubjectApprovalResponse[] = [];
  protected targetApprovalSubjects: SubjectApprovalResponse[] = [];
  protected maxLevel = 1;

  protected alphabetic: RegExp = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
  protected isNotCareerSelected = true;
  protected isCreatingUser = false;
  protected acceptUserDataMessge = signal<string[]>([]);
  protected isAcceptedDataUser = true;
  protected semestersApproval!: number[];

  protected approvalOptions: any[] = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ];

  ngOnInit() {
    this.formStudent = this.fb.group({
      name: [undefined, Validators.required],
      lastname: [undefined, Validators.required],
      genre: [undefined, Validators.required],
      career: [undefined, Validators.required],
      level: [{value: 1, disabled: this.isNotCareerSelected}, Validators.required],
      modality: [{value: 1, disabled: this.isNotCareerSelected}, Validators.required],
      bornDate: [new Date(), Validators.required],
      identification: [undefined, Validators.required],
      username: [{value: undefined, disabled: true}, Validators.required],
      email: [undefined, Validators.required],
      acceptUseOfData: [true, Validators.required],
      approval: [false, Validators.required],
      approvalSite: [''],
      semestersApproval: [{value: [], disabled: this.isNotCareerSelected}, Validators.required]
    });

    this.formStudent.get('identification')?.valueChanges.subscribe(value => {
      this.formStudent.get('username')?.setValue(value, { emitEvent: false });
    });
  }

  changeCareer(event: DropdownChangeEvent) {
    const codCareer = event.value as number;
    const careerSelected = this.careersAvailable$()?.find(c => c.codCarrera === codCareer)!;

    this.modalities = careerSelected.modalidades;
    this.maxLevel = careerSelected.niveles;
    this.isNotCareerSelected = false;
    this.semestersApproval = Array.from({ length: this.maxLevel }, (_, i) => i + 1);

    this.enabledFieldOnChangeCareer();
    this.resetFieldOnChangeCareer();
  }

  enabledFieldOnChangeCareer() {
    this.formStudent.get('level')?.enable();
    this.formStudent.get('modality')?.enable();
    this.formStudent.get('semestersApproval')?.enable();
  }

  resetFieldOnChangeCareer() {
    this.formStudent.get('level')?.reset();
    this.formStudent.get('modality')?.reset();
    this.formStudent.get('semestersApproval')?.reset();
    this.targetApprovalSubjects = [];
    this.approvalSubjects = [];
  }

  registerStudent() {
    if (this.formStudent.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Validar los campos correctamente'});
      this.formStudent.markAllAsTouched();
      return;
    }

    const userInfo: UserInfo = {
      cedula: this.formStudent.value.identification,
      correo: this.formStudent.value.email,
      nombre: this.formStudent.value.identification,
    }

    const studentRequest: StudentRegisterRequest = {
      nombre: this.formStudent.value.name,
      apellido: this.formStudent.value.lastname,
      genero: this.formStudent.value.genre,
      carrera: this.formStudent.value.career,
      nivel: this.formStudent.value.level,
      modalidad: this.formStudent.value.modality,
      fechaNacimiento: this.formStudent.value.bornDate,
      homologacion: this.formStudent.value.approval,
      lugarHomologacion: this.formStudent.value.approvalSite,
      aceptaUsoDatos: this.formStudent.value.acceptUseOfData,
      asignaturasHomologacion: this.targetApprovalSubjects.map((subjectApproval) => subjectApproval.codAsignatura),
      usuario: userInfo,
    }

    this.isCreatingUser = true;
    this.administratorService.registerStudent(studentRequest)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isCreatingUser = false))
      .subscribe({
        next: () => {
          this.messageService.add({severity: SeverityEnum.SUCCESS, summary: 'Exitoso', detail: 'Estudiante creado correctamente'});
          this.closeDialog();
        }
      })
  }

  protected validateAcceptmentUserData(activateCallback: (step: number) => void) {
    if (!this.formStudent.value.acceptUseOfData) {
      this.acceptUserDataMessge.set(
        ['El estudiante no aceptó el uso de sus datos personales. No se puede continuar su registro.']
      );

      this.isAcceptedDataUser = false;
    } else {
      activateCallback(2);
    }
  }

  protected getApprovalSubjects(event: MultiSelectChangeEvent) {
    const semestersApproval = event.value;

    if (semestersApproval.length > 0) {
      const approvalSubjectRequest: SubjectApprovalRequest = {
        codCarrera: this.formStudent.value.career,
        semestres: semestersApproval
      }

      this.administratorService.getApprovalSubjects(approvalSubjectRequest).subscribe((response) => {
        if (this.targetApprovalSubjects.length === 0 && response.length > 0) {
          this.approvalSubjects = response;
        } else {
          this.approvalSubjects = response.filter((subject) => !this.targetApprovalSubjects.map((subject) => subject.codAsignatura).includes(subject.codAsignatura));
        }
      })
    } else {
      this.approvalSubjects = [];
    }
  }

  protected formatSubjectName(descripcion: string, level: number, code: string) {
    return `Semestre ${level}: (${code}) ${descripcion}`;
  }

  closeDialog() {
    this.onClose.emit();
  }
}
