import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {AdministratorService} from '@app/service/administrator.service';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {StudentList} from '@app/model/student/student-list';

@Component({
  selector: 'app-student-filter',
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    Select,
    InputNumber,
    Button,
    Tooltip
  ],
  standalone: true,
  templateUrl: './student-filter.component.html',
  styleUrl: './student-filter.component.scss'
})
export class StudentFilterComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private administratorService = inject(AdministratorService);
  protected filterStudentForm!: FormGroup;
  @Output() listStudents = new EventEmitter<StudentList>();

  protected careersAvailable$ = toSignal(this.administratorService.getCareer());

  protected maxLevel = 1;
  protected isNotCareerSelected = true;

  ngOnInit() {
    this.filterStudentForm = this.fb.group({
      career: ['', Validators.required],
      level: [{value: 1, disabled: this.isNotCareerSelected}, Validators.required],
    })
  }

  changeCareer(event: DropdownChangeEvent) {
    const codCareer = event.value as number;
    const careerSelected = this.careersAvailable$()?.find(c => c.codCarrera === codCareer)!;

    this.maxLevel = careerSelected.niveles;
    this.filterStudentForm.get('level')?.enable();
    this.filterStudentForm.get('level')?.reset();
  }

  filterStudents() {
    this.listStudents.emit({
      codCareer: this.filterStudentForm.value.career,
      level: this.filterStudentForm.value.level
    });
  }
}
