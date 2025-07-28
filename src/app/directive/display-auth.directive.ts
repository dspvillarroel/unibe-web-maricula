import {Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {JwtService} from '@app/service/jwt.service';

@Directive({
  standalone: true,
  selector: '[appDisplayAuth]'
})
export class DisplayAuthDirective implements OnInit {
  jwtService = inject(JwtService);

  @Input('appDisplayAuth') rolesPermitidos: string[] = [];

  private userRoles: string[] | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
  }

  ngOnInit() {
    this.userRoles = this.jwtService.getRoles();

    if (!this.userRoles) {
      this.viewContainer.clear();
    }

    const haveRole = this.rolesPermitidos.some(role => this.userRoles!.includes(role));

    if (haveRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
