import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRegisterUserComponent } from './delete-register-user.component';

describe('DeleteRegisterUserComponent', () => {
  let component: DeleteRegisterUserComponent;
  let fixture: ComponentFixture<DeleteRegisterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRegisterUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRegisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
