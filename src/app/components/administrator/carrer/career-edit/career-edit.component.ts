import {Component, DestroyRef, EventEmitter, inject, input, Input, OnInit, Output} from '@angular/core';
import {CarreraInfoResponse} from '@app/model/career/carrera-info-response';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {Fieldset} from 'primeng/fieldset';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdministratorService} from '@app/service/administrator.service';
import {MessageService} from 'primeng/api';
import {toSignal} from '@angular/core/rxjs-interop';
import {CareerRequest} from '@app/model/career/career-request';

@Component({
  selector: 'app-career-edit',
  imports: [
    Button,
    Dialog,
    Fieldset,
    InputNumber,
    InputText,
    MultiSelect,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './career-edit.component.html',
  styleUrl: './career-edit.component.scss'
})
export class CareerEditComponent implements OnInit {
  @Input() showDialog = true;
  @Output() onClose = new EventEmitter<void>();

  private destroyRef = inject(DestroyRef);
  private fb = inject(NonNullableFormBuilder);
  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);
  protected formCareer!: FormGroup;
  protected isCreatingCareer = false;
  protected originalDataForm: any;

  protected modalities$ = toSignal(this.administratorService.getModalities());

  careerToEdit = input.required<CarreraInfoResponse>();


  ngOnInit() {
    const career = this.careerToEdit();

    this.formCareer = this.fb.group({
      career: [career.carrera, Validators.required],
      level: [career.niveles, Validators.required],
      modality: [career.modalidades.map(modalitity => modalitity.codModalidad), Validators.required],
      ciclo: [career.ciclo, Validators.required],
    });

    this.originalDataForm = this.formCareer.getRawValue();
  }


  saveCareer() {
    if (this.hasFormChanged()) {
      this.messageService.clear();
      this.messageService.add({severity: 'info', summary: 'Información', detail: 'No se cambió ningun valor'});
      return;
    }


    if (this.formCareer.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Validar los campos correctamente'});
      this.formCareer.markAllAsTouched();
      return;
    }

    const careerRequest: CareerRequest = {
      carrera: this.formCareer.value.career,
      niveles: this.formCareer.value.level,
      modalidades: this.formCareer.value.modality,
      ciclo: this.formCareer.value.ciclo,
    }

    this.administratorService.updateCareer(careerRequest, this.careerToEdit().codCarrera).subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Exitoso', detail: 'La carrera fue actualizada'});

      this.onClose.emit();
    })
  }

  hasFormChanged() {
    const currentValue = this.formCareer.getRawValue();
    return JSON.stringify(currentValue) === JSON.stringify(this.originalDataForm);
  }

  closeDialog() {
    this.onClose.emit();
  }
}
