import {Component, DestroyRef, EventEmitter, inject, input, Input, OnInit, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {Dialog} from 'primeng/dialog';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {Fieldset} from 'primeng/fieldset';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {KeyFilter} from 'primeng/keyfilter';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdministratorService} from '@app/service/administrator.service';
import {MessageService} from 'primeng/api';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {ModalityInfoResponse} from '@app/model/modality/modality-info-response';
import {UserInfo} from '@app/model/user/user-info';
import {StudentRegisterRequest} from '@app/model/student/student-register-request';
import {finalize} from 'rxjs';
import {SeverityEnum} from '@app/enum/severity-enum';
import {UtilConst} from '@app/const/util-const';
import {StudentInfoResponse} from '@app/model/administrator/response/student-info-response';
import {CarreraInfoResponse} from '@app/model/career/carrera-info-response';
import {Toast} from 'primeng/toast';
import {Checkbox} from "primeng/checkbox";
import {MultiSelect, MultiSelectChangeEvent} from "primeng/multiselect";
import {PickList} from "primeng/picklist";
import {Select} from "primeng/select";
import {Step, StepList, StepPanel, StepPanels, Stepper} from "primeng/stepper";
import {SubjectApprovalRequest} from '@app/model/subject/subject-approval-request';
import {SubjectApprovalResponse} from '@app/model/subject/subject-approval-response';

@Component({
  selector: 'app-student-edit',
  imports: [
    Button,
    DatePicker,
    Dialog,
    DropdownModule,
    Fieldset,
    InputNumber,
    InputText,
    KeyFilter,
    ReactiveFormsModule,
    Toast,
    Checkbox,
    MultiSelect,
    PickList,
    Select,
    Step,
    StepList,
    StepPanel,
    StepPanels,
    Stepper
  ],
  standalone: true,
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.scss'
})
export class StudentEditComponent implements OnInit {
  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  protected fb = inject(NonNullableFormBuilder);

  @Input() showDialog = true;
  studentToEdit = input.required<StudentInfoResponse>();
  @Output() onClose = new EventEmitter<void>();

  protected genresAvailable$ = toSignal(this.administratorService.getGenres());

  protected carreras: CarreraInfoResponse[] = [];
  protected formStudent!: FormGroup;
  protected readonly UtilConst = UtilConst;
  protected modalities: ModalityInfoResponse[] = [];
  protected maxLevel = 1;
  protected alphabetic: RegExp = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
  protected isNotCareerSelected = true;
  protected isCreatingUser = false;
  protected originalDataForm: any;
  protected semestersApproval!: number[];
  protected approvalSubjects: SubjectApprovalResponse[] = [];
  protected targetApprovalSubjects: SubjectApprovalResponse[] = [];

  ngOnInit() {
    const studentToEdit = this.studentToEdit();
    this.getCareersAndSetCurrent(studentToEdit.codCarrera);

    this.formStudent = this.fb.group({
      identification: [{value: studentToEdit.cedula, disabled: true}, Validators.required],
      name: [studentToEdit.nombres, Validators.required],
      lastname: [studentToEdit.apellidos, Validators.required],
      genre: [studentToEdit.codGenero, Validators.required],
      career: [studentToEdit.codCarrera, Validators.required],
      level: [{value: studentToEdit.nivel, disabled: false}, Validators.required],
      modality: [{value: studentToEdit.codModalidad, disabled: false}, Validators.required],
      bornDate: [new Date(studentToEdit.fechaNacimiento), Validators.required],
      username: [{value: studentToEdit.usuario, disabled: true}, Validators.required],
      email: [studentToEdit.correo, Validators.required],
      acceptUseOfData: [true, Validators.required],
      approval: [studentToEdit.homologacion, Validators.required],
      approvalSite: [studentToEdit.lugarHomologacion],
      semestersApproval: [[]]
    });

    this.originalDataForm = this.formStudent.getRawValue();
  }

  protected getCareersAndSetCurrent(codCarrera: number) {
    this.administratorService.getCareer().subscribe((response) => {
      this.carreras = response
      this.setModalities(codCarrera);
    });
  }

  private getCurrentSubjects(codEstudiante: number) {
    this.administratorService.getSubjectsPerStudent(codEstudiante).subscribe((response) => {
      this.targetApprovalSubjects = response;
    })
  }

  private setModalities(codCareer: number) {
    const careerSelected = this.carreras.find(c => c.codCarrera === codCareer)!;
    this.modalities = careerSelected.modalidades;
    this.maxLevel = careerSelected.niveles;
    this.semestersApproval = Array.from({length: this.maxLevel}, (_, i) => i + 1);
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

  changeCareer(event: DropdownChangeEvent) {
    const codCareer = event.value as number;
    this.setModalities(codCareer);

    this.isNotCareerSelected = false;
    this.resetFieldOnChangeCareer();
  }

  resetFieldOnChangeCareer() {
    this.formStudent.get('level')?.setValue(1);
    this.formStudent.get('modality')?.setValue('');

    this.approvalSubjects = [];
    this.targetApprovalSubjects = [];
  }

  updateStudent() {
    if (this.hasFormChanged()) {
      this.messageService.clear();
      this.messageService.add({severity: 'info', summary: 'Información', detail: 'No se cambió ningun valor'});
      return;
    }

    if (this.formStudent.invalid) {
      console.log(this.formStudent.errors)
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Validar los campos correctamente'});
      this.formStudent.markAllAsTouched();
      return;
    }

    if (this.formStudent.value.approval && this.targetApprovalSubjects.length === 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Se debe escoger al menos una materia cuando se realiza una homologación'});
      return;
    }

    const userInfo: UserInfo = {
      cedula: this.studentToEdit().cedula,
      correo: this.formStudent.value.email,
      nombre: this.studentToEdit().cedula,
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
      asignaturasHomologacion: this.targetApprovalSubjects.map((subject) => subject.codAsignatura),
      aceptaUsoDatos: true,
      usuario: userInfo,
    }

    this.isCreatingUser = true;
    this.administratorService.updateStudent(studentRequest, this.studentToEdit().codUsuario)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isCreatingUser = false))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: SeverityEnum.SUCCESS,
            summary: 'Exitoso',
            detail: 'Estudiante actualizado correctamente'
          });
          this.closeDialog();
        }
      })
  }

  protected formatSubjectName(descripcion: string, level: number, code: string) {
    return `Semestre ${level}: (${code}) ${descripcion}`;
  }

  protected intoCareerInfo(activateCallback: (step: number) => void) {
    if (this.formStudent.value.approval) {
        this.getCurrentSubjects(this.studentToEdit().codEstudiante);
    } else {
      this.targetApprovalSubjects = [];
    }

    activateCallback(2);
  }

  hasFormChanged() {
    const currentValue = this.formStudent.getRawValue();
    return JSON.stringify(currentValue) === JSON.stringify(this.originalDataForm);
  }

  closeDialog() {
    this.onClose.emit();
  }
}
