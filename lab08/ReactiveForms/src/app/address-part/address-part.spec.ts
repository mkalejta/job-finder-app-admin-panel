import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPart } from './address-part';

describe('AddressPart', () => {
  let component: AddressPart;
  let fixture: ComponentFixture<AddressPart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressPart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressPart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
