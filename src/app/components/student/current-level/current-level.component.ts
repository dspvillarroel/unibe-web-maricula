import {Component, computed, inject} from '@angular/core';
import {StudentService} from '@app/service/student.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {OrganizationChart} from 'primeng/organizationchart';
import {PrimeTemplate, TreeNode} from 'primeng/api';

@Component({
  selector: 'app-current-level',
  imports: [
    OrganizationChart,
    PrimeTemplate
  ],
  standalone: true,
  templateUrl: './current-level.component.html',
  styleUrl: './current-level.component.scss'
})
export class CurrentLevelComponent {
  private studentService = inject(StudentService);

  protected readonly studentCurrentLevel$ = toSignal(
    this.studentService.getCurrentLevel()
  );

  protected readonly studentTreeData$ = computed((): TreeNode[] => {
    const asignaturas = this.studentCurrentLevel$();

    if (!asignaturas) return [];

    const agrupado: { [tipo: string]: TreeNode } = {};

    for (const asignatura of asignaturas) {
      const tipo = asignatura.tipoAsignatura;

      if (!agrupado[tipo]) {
        agrupado[tipo] = {
          expanded: true,
          label: tipo,
          type: 'subjectType',
          data: {
            code: tipo,
            title: 'Asignaturas'
          },
          children: []
        };
      }

      agrupado[tipo].children!.push({
        type: 'person',
        data: {
          code: asignatura.codAsignatura,
          title: asignatura.descripcion,
          horas: asignatura.horas,
          credits: asignatura.creditos,
          semester: asignatura.nivel
        }
      });
    }

    return [
      {
        expanded: true,
        type: 'person',
        data: {
          code: 'Software',
          title: 'Malla Curricular',
          horas: 800
        },
        children: Object.values(agrupado)
      }
    ];
  });
}
