import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosPorVencerComponent } from './contratos-por-vencer.component';

describe('ContratosPorVencerComponent', () => {
  let component: ContratosPorVencerComponent;
  let fixture: ComponentFixture<ContratosPorVencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratosPorVencerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratosPorVencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
