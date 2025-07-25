import {Component, computed, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {CareerCreateComponent} from '@app/components/administrator/carrer/career-create/career-create.component';
import {CareerEditComponent} from '@app/components/administrator/carrer/career-edit/career-edit.component';
import {Toolbar} from 'primeng/toolbar';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {Toast} from 'primeng/toast';
import {Table, TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Skeleton} from 'primeng/skeleton';
import {NgForOf, NgIf} from '@angular/common';
import {BehaviorSubject, of} from 'rxjs';
import {CarreraInfoResponse} from '@app/model/career/carrera-info-response';
import {StudentInfoResponse} from '@app/model/administrator/response/student-info-response';
import {AdministratorService} from '@app/service/administrator.service';

@Component({
  selector: 'app-careers-management',
  imports: [
    CareerCreateComponent,
    CareerEditComponent,
    Toolbar,
    Button,
    Tooltip,
    Toast,
    TableModule,
    Tag,
    Skeleton,
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './careers-management.component.html',
  styleUrl: './careers-management.component.scss'
})
export class CareersManagementComponent {
  @ViewChild('careerTable') careerTable!: Table;

  private administratorService = inject(AdministratorService);

  protected isCreatedCareer: WritableSignal<boolean> = signal(false);
  protected isEditingCareer: WritableSignal<boolean> = signal(false);
  protected showDialog = computed(() => this.isCreatedCareer());
  protected showDialogEdit = computed(() => this.isEditingCareer());
  protected loadingCareers = new BehaviorSubject<boolean>(false);

  protected careers: CarreraInfoResponse[] = [];
  protected totalCareers: number = 0;
  protected careersPerPage: number = 10;
  protected careerToEdit!: CarreraInfoResponse;


  getCareers(event: TableLazyLoadEvent) {
    const pageNo = (event.first ?? 0) / this.careersPerPage;

    this.administratorService.getCareersPage(pageNo, this.careersPerPage).subscribe(careers => {
      this.careers = careers.careers;
      this.totalCareers = careers.totalCareers;
    })
  }

  protected createCareer() {
    this.isCreatedCareer.set(true);
  }

  protected editCareer(career: CarreraInfoResponse) {
    this.careerToEdit = career;
    this.isEditingCareer.set(true);
  }

  protected refreshCareers() {
    this.isCreatedCareer.set(false);
    this.isEditingCareer.set(false);

    this.careerTable.reset();
  }

  protected readonly of = of;
}
