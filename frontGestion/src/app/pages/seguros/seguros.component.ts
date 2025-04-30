import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SeguroService } from '../../core/services/seguro.service';
import { Seguro } from '../../models/seguro.model';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-seguros',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    NgIf,
    NgFor
  ],
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css']
  // 🔴 IMPORTANTE: NO uses ViewEncapsulation.None
  // Angular usará 'Emulated' por defecto, lo que es correcto.
})
export class SegurosComponent implements OnInit {
  seguros: Seguro[] = [];
  loading = true;

  constructor(private seguroService: SeguroService) {}

  ngOnInit(): void {
    this.seguroService.obtenerSegurosActivos().subscribe({
      next: (data) => {
        console.log('Seguros recibidos:', data);
        this.seguros = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros', err);
        this.loading = false;
      }
    });
  }
}
