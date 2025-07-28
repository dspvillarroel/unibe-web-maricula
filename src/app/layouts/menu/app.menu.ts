import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AppMenuitem} from './app.menuitem';
import {environment} from '@env/environment';
import {JwtService} from '@app/service/jwt.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul> `
})
export class AppMenu {
  private jwtService = inject(JwtService);
  model: MenuItem[] = [];

  ngOnInit() {
    const model = [
      {
        label: 'Home',
        items: [{label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard']}]
      },
      {
        label: 'Administración',
        items: [
          {label: 'Nivel Actual', icon: 'pi pi-circle', class: 'rotated-icon', routerLink: ['current-level'], roles: [environment.roleEstudiante]},
          {label: 'Estudiantes', icon: 'pi pi-user', routerLink: ['student-management'], roles: [environment.roleAdministrator]},
          {label: 'Carreras', icon: 'pi pi-graduation-cap', routerLink: ['career-management'], roles: [environment.roleAdministrator]},
          {label: 'Asignaturas', icon: 'pi pi-fw pi-table', routerLink: ['subject-management'], roles: [environment.roleAdministrator]},
        ]
      },
    ];

    this.model = this.filterMenuByRoles(model);
  }

  private filterMenuByRoles(menu: MenuItem[]): MenuItem[] {
    return menu
      .map(section => ({
        ...section,
        items: section.items?.filter(item => {
          if (!item['roles']) return true;
          return this.jwtService.hasRole(item['roles']);
        })
      }))
      .filter(section => section.items && section.items.length > 0);
  }
}
