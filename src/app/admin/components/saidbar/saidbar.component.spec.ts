import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidbarComponent } from './saidbar.component';

describe('SaidbarComponent', () => {
  let component: SaidbarComponent;
  let fixture: ComponentFixture<SaidbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaidbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaidbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
