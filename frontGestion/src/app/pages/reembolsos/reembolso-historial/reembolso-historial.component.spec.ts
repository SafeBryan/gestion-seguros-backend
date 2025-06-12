import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReembolsoHistorialComponent } from './reembolso-historial.component';

describe('ReembolsoHistorialComponent', () => {
  let component: ReembolsoHistorialComponent;
  let fixture: ComponentFixture<ReembolsoHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReembolsoHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReembolsoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
