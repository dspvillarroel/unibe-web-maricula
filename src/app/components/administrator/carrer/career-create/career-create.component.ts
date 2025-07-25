import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Fieldset} from 'primeng/fieldset';
import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import {MultiSelect} from 'primeng/multiselect';
import {AdministratorService} from '@app/service/administrator.service';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {MessageService} from 'primeng/api';
import {CareerRequest} from '@app/model/career/career-request';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-career-create',
  imports: [
    Dialog,
    Button,
    ReactiveFormsModule,
    Fieldset,
    InputText,
    InputNumber,
    MultiSelect
  ],
  standalone: true,
  templateUrl: './career-create.component.html',
  styleUrl: './career-create.component.scss',
  providers: [MessageService]
})
export class CareerCreateComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private fb = inject(NonNullableFormBuilder);
  private administratorService = inject(AdministratorService);
  private messageService = inject(MessageService);

  protected modalities$ = toSignal(this.administratorService.getModalities());

  @Input() showDialog = true;
  @Output() onClose = new EventEmitter<void>();

  protected isCreatingCareer = false;
  protected formCareer!: FormGroup;


  ngOnInit() {
    this.formCareer = this.fb.group({
      career: ['', Validators.required],
      level: [1, Validators.required],
      modality: [[], Validators.required],
      ciclo: ['', Validators.required],
    });
  }

  registerCareer() {
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

    this.isCreatingCareer = true;

    this.administratorService.createCareer(careerRequest)
      .pipe(finalize(() => this.isCreatingCareer = false), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.messageService.add({severity: 'success', summary: 'Exitoso', detail: 'La carrera fue creada'});
        this.closeDialog();
      })
  }

  closeDialog() {
    this.onClose.emit();
  }
}
