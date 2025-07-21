import {Routes} from '@angular/router';
import {AppLayout} from './layouts/menu/app.layout';
import {LoginComponent} from '@app/components/security/login/login.component';
import {authGuard} from '@app/auth/auth.guard';
import {DashboardComponent} from '@app/components/dashboard/dashboard.component';
import {CurrentLevelComponent} from '@app/components/student/current-level/current-level.component';
import {
  StudentManagementComponent
} from '@app/components/administrator/student-management/student-management.component';

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
    ]
  }
];
