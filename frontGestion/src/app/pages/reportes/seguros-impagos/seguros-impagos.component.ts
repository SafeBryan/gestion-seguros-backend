import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../core/services/reporte.service';

@Component({
  selector: 'app-seguros-impagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seguros-impagos.component.html',
  styleUrls: ['./seguros-impagos.component.css'],
})
export class SegurosImpagosComponent implements OnInit {
  segurosImpagos: any[] = [];
  cargando: boolean = true;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.obtenerSegurosImpagos();
  }

  obtenerSegurosImpagos() {
    this.cargando = true;
    this.reporteService.getSegurosImpagos().subscribe({
      next: (data) => {
        this.segurosImpagos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando seguros impagos:', err);
        this.cargando = false;
      },
    });
  }
}
