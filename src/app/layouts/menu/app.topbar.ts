import {Component, inject} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {StyleClassModule} from 'primeng/styleclass';
import {LayoutService} from '@app/service/layout/layout.service';
import {AuthService} from '@app/service/auth.service';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, Tooltip],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-logo-container">
        <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
          <i class="pi pi-bars"></i>
        </button>

        <a class="layout-topbar-logo" routerLink="/dashboard">
          <img src="/assets/logo.webp" alt="Logo" width="40vw">
          <span>UNIB.E</span>
        </a>
      </div>

      <div class="layout-topbar-actions">
        <div class="layout-config-menu">
          <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
            <i
              [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
          </button>
        </div>

        <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden"
                enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout"
                [hideOnOutsideClick]="true">
          <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu hidden lg:block">
          <div class="layout-topbar-menu-content">
            <button type="button" class="layout-topbar-action" (click)="logout()" pTooltip="Cerrar Sesi&oacute;n">
              <i class="pi pi-sign-out"></i>
              <span>Cerrar Sesi&oacute;n</span>
            </button>
          </div>
        </div>
      </div>
    </div>`
})
export class AppTopbar {
  items!: MenuItem[];
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(public layoutService: LayoutService) {
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({...state, darkTheme: !state.darkTheme}));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["login"]);
  }
}
