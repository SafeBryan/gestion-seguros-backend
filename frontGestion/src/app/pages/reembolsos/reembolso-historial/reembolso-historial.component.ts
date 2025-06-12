import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { AuthService } from '../../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reembolso-historial',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './reembolso-historial.component.html',
  styleUrls: ['./reembolso-historial.component.css'],
})
export class ReembolsoHistorialComponent implements OnInit {
  reembolsos: any[] = [];
  cargando = true;

  constructor(
    private reembolsoService: ReembolsoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const clienteId = this.authService.getUsuarioId();
    this.reembolsoService.obtenerPorCliente(clienteId).subscribe({
      next: (data) => {
        this.reembolsos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        console.error('Error al cargar reembolsos');
      },
    });
  }
}
