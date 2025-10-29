import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Value } from './value';

describe('Value', () => {
  let component: Value;
  let fixture: ComponentFixture<Value>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Value]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Value);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
