import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-root',
  template: `
    <p-toast></p-toast>
    <router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: []

})
export class AppComponent {
  title = 'web-expenses';
}
