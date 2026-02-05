import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilteringParams } from '../../interface/FilteringParams';
import { FilterField } from '../../interface/FilterField';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanelComponent implements OnInit {
  public fields = input.required<FilterField[]>();
  public initialFilter = input<FilteringParams>({ filters: {} });
  public filterChange = output<FilteringParams>();

  public isExpanded = signal(false);
  public filterValues: Record<string, unknown> = {};
  private initialFilterValues: Record<string, unknown> = {};

  public ngOnInit(): void {
    this.initializeFilterValues();
    this.applyFilters();
  }

  public toggleExpanded(): void {
    this.isExpanded.update((state) => !state);
  }

  private initializeFilterValues(): void {
    const initialFilters = this.initialFilter().filters;
    
    this.fields().forEach((field) => {
      if (field.type === 'checkbox') {
        this.filterValues[field.id] = initialFilters[field.id] || [];
      } else {
        this.filterValues[field.id] = initialFilters[field.id] || '';
      }
    });

    this.initialFilterValues = { ...this.filterValues };
  }

  public isChecked(fieldId: string, optionId: string): boolean {
    const value = this.filterValues[fieldId];

    return Array.isArray(value) && value.includes(optionId);
  }

  public onCheckboxChange(fieldId: string, optionId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentValue = this.filterValues[fieldId] as string[];
    
    if (checkbox.checked) {
      this.filterValues[fieldId] = [...currentValue, optionId];
    } else {
      this.filterValues[fieldId] = currentValue.filter((id) => id !== optionId);
    }
  }

  public applyFilters(): void {
    const filters = { ...this.filterValues };
    
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        delete filters[key];
      }
    });

    this.filterChange.emit({ filters });
  }

  public resetFilters(): void {
    this.fields().forEach((field) => {
      if (field.type === 'checkbox') {
        this.filterValues[field.id] = [];
      } else {
        this.filterValues[field.id] = '';
      }
    });
    this.initialFilterValues = { ...this.filterValues };
    this.applyFilters();
  }
}

