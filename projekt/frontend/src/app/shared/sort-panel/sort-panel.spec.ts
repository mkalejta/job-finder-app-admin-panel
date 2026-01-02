import { TestBed } from '@angular/core/testing';
import { SortPanel } from './sort-panel';
import { FormsModule } from '@angular/forms';

describe('SortPanel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortPanel, FormsModule],
    }).compileComponents();
  });
});

