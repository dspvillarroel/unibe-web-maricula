import {Routes} from '@angular/router';
import {AppLayout} from './layouts/menu/app.layout';
import {LoginComponent} from '@app/components/security/login/login.component';
import {authGuard} from '@app/auth/auth.guard';
import {DashboardComponent} from '@app/components/dashboard/dashboard.component';
import {CurrentLevelComponent} from '@app/components/student/current-level/current-level.component';
import {
  StudentManagementComponent
} from '@app/components/administrator/student/student-management/student-management.component';
import {
  CareersManagementComponent
} from '@app/components/administrator/carrer/careers-management/careers-management.component';
import {
  SubjectManagmentComponent
} from '@app/components/administrator/subject/subject-managment/subject-managment.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
      {path: 'current-level', component: CurrentLevelComponent, canActivate: [authGuard]},
      {path: 'student-management', component: StudentManagementComponent, canActivate: [authGuard]},
      {path: 'career-management', component: CareersManagementComponent, canActivate: [authGuard]},
      {path: 'subject-management', component: SubjectManagmentComponent, canActivate: [authGuard]},
    ]
  }
];
