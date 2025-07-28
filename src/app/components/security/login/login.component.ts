import {Component, inject, OnInit} from '@angular/core';
import {Password} from 'primeng/password';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {LoginRequest} from '@app/model/security/request/login-request';
import {Toast} from 'primeng/toast';
import {SeverityEnum} from '@app/enum/severity-enum';
import {MessageService} from 'primeng/api';
import {SecurityService} from '@app/service/security.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    Password,
    ReactiveFormsModule,
    InputGroup,
    InputGroupAddon,
    InputText,
    Button,
    Toast
  ],
  standalone: true,
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly securityService = inject(SecurityService);
  private readonly router = inject(Router);

  protected loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  protected login() {
    if (this.loginForm.invalid) {
      this.showAlert(SeverityEnum.WARN, 'Advertencia', 'Todos los campos son obligatorios');
      return;
    }

    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.securityService.login(loginRequest).subscribe(
      response => {
        localStorage.setItem('token', response.accessToken);

        if (!response.isEnabled) {
          this.securityService.activateAccount().subscribe();
        }

        this.router.navigateByUrl("dashboard")
      }
    )
  }


  protected showAlert(severity: SeverityEnum, summary: string, detail: string) {
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }
}
