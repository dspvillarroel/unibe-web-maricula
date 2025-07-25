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
import {finalize, tap} from 'rxjs';
import {SeverityEnum} from '@app/enum/severity-enum';
import {UtilConst} from '@app/const/util-const';
import {StudentInfoResponse} from '@app/model/administrator/response/student-info-response';
import {CarreraInfoResponse} from '@app/model/career/carrera-info-response';
import {Toast} from 'primeng/toast';

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
    Toast
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

  ngOnInit() {
    const studentToEdit = this.studentToEdit();
    this.getCareersAndSetCurrent(studentToEdit.codCarrera);

    this.formStudent = this.fb.group({
      name: [studentToEdit.nombres, Validators.required],
      lastname: [studentToEdit.apellidos, Validators.required],
      genre: [studentToEdit.codGenero, Validators.required],
      career: [studentToEdit.codCarrera, Validators.required],
      level: [{value: studentToEdit.nivel, disabled: false}, Validators.required],
      modality: [{value: studentToEdit.codModalidad, disabled: false}, Validators.required],
      bornDate: [new Date(studentToEdit.fechaRegistro), Validators.required],
      username: [studentToEdit.usuario, Validators.required],
      email: [studentToEdit.correo, Validators.required],
    });

    this.originalDataForm = this.formStudent.getRawValue();
  }

  protected getCareersAndSetCurrent(codCarrera: number) {
    this.administratorService.getCareer().subscribe((response) => {
      this.carreras = response
      this.setModalities(codCarrera);
    });
  }

  private setModalities(codCareer: number) {
    const careerSelected = this.carreras.find(c => c.codCarrera === codCareer)!;
    this.modalities = careerSelected.modalidades;
    this.maxLevel = careerSelected.niveles;
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
  }

  updateStudent() {
    if (this.hasFormChanged()) {
      this.messageService.clear();
      this.messageService.add({severity: 'info', summary: 'Información', detail: 'No se cambió ningun valor'});
      return;
    }


    if (this.formStudent.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Validar los campos correctamente'});
      this.formStudent.markAllAsTouched();
      return;
    }

    const userInfo: UserInfo = {
      cedula: this.studentToEdit().cedula,
      correo: this.formStudent.value.email,
      nombre: this.formStudent.value.username,
    }

    const studentRequest: StudentRegisterRequest = {
      nombre: this.formStudent.value.name,
      apellido: this.formStudent.value.lastname,
      genero: this.formStudent.value.genre,
      carrera: this.formStudent.value.career,
      nivel: this.formStudent.value.level,
      modalidad: this.formStudent.value.modality,
      fechaNacimiento: this.formStudent.value.bornDate,
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


  hasFormChanged() {
    const currentValue = this.formStudent.getRawValue();
    return JSON.stringify(currentValue) === JSON.stringify(this.originalDataForm);
  }

  closeDialog() {
    this.onClose.emit();
  }
}
