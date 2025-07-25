import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {Tooltip} from 'primeng/tooltip';
import {AdministratorService} from '@app/service/administrator.service';
import {StudentList} from '@app/model/student/student-list';
import {toSignal} from '@angular/core/rxjs-interop';
import {DropdownChangeEvent} from 'primeng/dropdown';
import {SubjectList} from '@app/model/subject/subject-list';

@Component({
  selector: 'app-subject-filter',
  imports: [
    Button,
    InputNumber,
    ReactiveFormsModule,
    Select,
    Tooltip
  ],
  standalone: true,
  templateUrl: './subject-filter.component.html',
  styleUrl: './subject-filter.component.scss'
})
export class SubjectFilterComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private administratorService = inject(AdministratorService);
  protected filterStudentForm!: FormGroup;
  @Output() listStudents = new EventEmitter<SubjectList>();

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
      level: this.filterStudentForm.value.level,
      maxLevel: this.maxLevel
    });
  }
}
