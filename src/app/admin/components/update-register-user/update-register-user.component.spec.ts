import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRegisterUserComponent } from './update-register-user.component';

describe('UpdateRegisterUserComponent', () => {
  let component: UpdateRegisterUserComponent;
  let fixture: ComponentFixture<UpdateRegisterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRegisterUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRegisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
