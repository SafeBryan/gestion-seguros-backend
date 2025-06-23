import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosVencidosComponent } from './contratos-vencidos.component';

describe('ContratosVencidosComponent', () => {
  let component: ContratosVencidosComponent;
  let fixture: ComponentFixture<ContratosVencidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratosVencidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratosVencidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
