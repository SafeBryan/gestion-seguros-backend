import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReembolsosPendientesComponent } from './reembolsos-pendientes.component';

describe('ReembolsosPendientesComponent', () => {
  let component: ReembolsosPendientesComponent;
  let fixture: ComponentFixture<ReembolsosPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReembolsosPendientesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReembolsosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
