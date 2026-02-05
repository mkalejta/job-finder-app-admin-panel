import { Component, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortingParams } from '../../interface/SortingParams';

export interface SortField {
  id: string;
  label: string;
}

@Component({
  selector: 'app-sort-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-panel.html',
  styleUrl: './sort-panel.scss',
})
export class SortPanelComponent implements OnInit {
  public fields = input.required<SortField[]>();
  public initialSort = input<SortingParams>({ sort: '', direction: 'ASC' });
  public sortChange = output<SortingParams>();

  public selectedField = '';
  public selectedDirection: 'ASC' | 'DESC' = 'ASC';
  
  public ngOnInit(): void {
    const initial = this.initialSort();
    this.selectedField = initial.sort || '';
    this.selectedDirection = initial.direction || 'ASC';
  }

  public applySort(): void {
    if (this.selectedField) {
      this.sortChange.emit({
        sort: this.selectedField,
        direction: this.selectedDirection,
      });
    }
  }
}
