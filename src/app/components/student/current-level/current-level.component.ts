import {Component, inject} from '@angular/core';
import {StudentService} from '@app/service/student.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {JsonPipe} from '@angular/common';
import {OrganizationChart} from 'primeng/organizationchart';
import {PrimeTemplate, TreeNode} from 'primeng/api';

@Component({
  selector: 'app-current-level',
  imports: [
    JsonPipe,
    OrganizationChart,
    PrimeTemplate
  ],
  standalone: true,
  templateUrl: './current-level.component.html',
  styleUrl: './current-level.component.scss'
})
export class CurrentLevelComponent {
  private studentService = inject(StudentService);

  protected readonly studentCurrenLevel$ = toSignal(
    this.studentService.getCurrentLevel()
  )

  data: TreeNode[] = [
    {
      expanded: true,
      type: 'person',
      data: {
        name: 'Software',
        title: 'Malla Curricular'
      },
      children: [
        {
          expanded: true,
          type: 'person',
          data: {
            name: 'Anna Fali',
            title: 'CMO'
          },
          children: [
            {
              label: 'Sales'
            },
            {
              label: 'Marketing'
            }
          ]
        },
        {
          expanded: true,
          type: 'person',
          data: {
            name: 'Stephen Shaw',
            title: 'CTO'
          },
          children: [
            {
              label: 'Development'
            },
            {
              label: 'UI/UX Design'
            }
          ]
        }
      ]
    }
  ];
}
