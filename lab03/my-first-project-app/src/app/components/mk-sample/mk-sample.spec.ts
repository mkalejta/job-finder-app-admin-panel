import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkSample } from './mk-sample';

describe('MkSample', () => {
  let component: MkSample;
  let fixture: ComponentFixture<MkSample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkSample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MkSample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
