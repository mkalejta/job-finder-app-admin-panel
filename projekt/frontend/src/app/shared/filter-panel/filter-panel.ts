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
export class FilterPanel implements OnInit {
  fields = input.required<FilterField[]>();
  initialFilter = input<FilteringParams>({ filters: {} });
  filterChange = output<FilteringParams>();

  isExpanded = signal(false);
  filterValues: Record<string, unknown> = {};
  private initialFilterValues: Record<string, unknown> = {};

  ngOnInit(): void {
    this.initializeFilterValues();
    this.applyFilters();
  }

  toggleExpanded(): void {
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

  isChecked(fieldId: string, optionId: string): boolean {
    const value = this.filterValues[fieldId];
    return Array.isArray(value) && value.includes(optionId);
  }

  onCheckboxChange(fieldId: string, optionId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentValue = this.filterValues[fieldId] as string[];
    
    if (checkbox.checked) {
      this.filterValues[fieldId] = [...currentValue, optionId];
    } else {
      this.filterValues[fieldId] = currentValue.filter((id) => id !== optionId);
    }
  }

  applyFilters(): void {
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

  resetFilters(): void {
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

