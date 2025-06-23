import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosPorClienteComponent } from './contratos-por-cliente.component';

describe('ContratosPorClienteComponent', () => {
  let component: ContratosPorClienteComponent;
  let fixture: ComponentFixture<ContratosPorClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratosPorClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratosPorClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
