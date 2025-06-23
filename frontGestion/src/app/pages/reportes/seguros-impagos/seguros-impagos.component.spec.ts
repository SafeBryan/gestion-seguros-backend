import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegurosImpagosComponent } from './seguros-impagos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReporteService } from '../../../core/services/reporte.service';

describe('SegurosImpagosComponent', () => {
  let component: SegurosImpagosComponent;
  let fixture: ComponentFixture<SegurosImpagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SegurosImpagosComponent,
        HttpClientTestingModule, // 👈 Importamos el módulo de prueba para HttpClient
      ],
      providers: [
        ReporteService, // 👈 Inyectamos el servicio que el componente necesita
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SegurosImpagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
