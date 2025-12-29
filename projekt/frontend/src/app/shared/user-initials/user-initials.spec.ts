import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInitials } from './user-initials';

describe('UserInitials', () => {
  let component: UserInitials;
  let fixture: ComponentFixture<UserInitials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInitials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInitials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
