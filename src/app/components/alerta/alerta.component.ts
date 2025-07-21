import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  standalone: true,
  imports: [
    Dialog,
    Button
  ]
})
export class AlertaComponent {
  @Input() visible = false;
  descripcion =  input.required<string>();
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();


  onCancelar() {
    this.visibleChange.emit(false);
    this.cancelar.emit();
  }

  onConfirm() {
    this.visibleChange.emit(false);
    this.confirmar.emit();
  }
}
