import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
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
  ],
  standalone: true,
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.scss',
  providers: [MessageService]
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
  protected maxLevel = 1;

  protected alphabetic: RegExp = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
  protected isNotCareerSelected = true;
  protected isCreatingUser = false;

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
      username: [undefined, Validators.required],
      email: [undefined, Validators.required],
    });
  }

  changeCareer(event: DropdownChangeEvent) {
    const codCareer = event.value as number;
    const careerSelected = this.careersAvailable$()?.find(c => c.codCarrera === codCareer)!;

    this.modalities = careerSelected.modalidades;
    this.maxLevel = careerSelected.niveles;
    this.isNotCareerSelected = false;

    this.enabledFieldOnChangeCareer();
    this.resetFieldOnChangeCareer();
  }

  enabledFieldOnChangeCareer() {
    this.formStudent.get('level')?.enable();
    this.formStudent.get('modality')?.enable();
  }

  resetFieldOnChangeCareer() {
    this.formStudent.get('level')?.reset();
    this.formStudent.get('modality')?.reset();
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
    this.administratorService.registerStudent(studentRequest)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isCreatingUser = false))
      .subscribe({
        next: () => {
          this.messageService.add({severity: SeverityEnum.SUCCESS, summary: 'Exitoso', detail: 'Estudiante creado correctamente'});
          this.closeDialog();
        }
      })
  }

  closeDialog() {
    this.onClose.emit();
  }
}
