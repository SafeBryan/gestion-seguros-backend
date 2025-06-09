import { Component, ViewChild, TemplateRef, inject } from '@angular/core'; 
import { Contrato } from '../../../models/contrato.model'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { ContratosFormComponent } from '../contratos-form/contratos-form.component'; 
import { ContratosListComponent } from '../contratos-list/contratos-list.component';  

// Material imports 
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatDividerModule } from '@angular/material/divider'; 
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';  
import { AuthService } from '../../../services/auth.service';

@Component({   
  selector: 'app-contratos-page',   
  standalone: true,   
  templateUrl: './contratos-page.component.html',   
  styleUrls: ['./contratos-page.component.css'],   
  imports: [     
    CommonModule,     
    FormsModule,     
    ContratosFormComponent,     
    ContratosListComponent,     
    MatButtonModule,     
    MatIconModule,     
    MatCardModule,     
    MatDividerModule,     
    MatTabsModule,     
    MatDialogModule,     
    MatTooltipModule,     
    MatSnackBarModule   
  ], 
})
export class ContratosPageComponent {   
  contratoAEditar?: Contrato;   
  dialogRef: MatDialogRef<any> | null = null;      
  authService = inject(AuthService); // Inject AuthService if needed
  esCliente: boolean = false;
  
  
  // Use ViewChild to access the ContratosListComponent directly
  @ViewChild(ContratosListComponent) contratosListComponent!: ContratosListComponent;
  @ViewChild('formDialogTemplate') formDialogTemplate!: TemplateRef<any>;    

  constructor(private dialog: MatDialog) {
    const perfil = this.authService.getUsuarioPerfil();
    const roles: string[] = perfil && Array.isArray((perfil as any).roles) ? (perfil as any).roles : [];
    this.esCliente = roles.includes('ROLE_USER');
  }    

  nuevoContrato() {     
    this.contratoAEditar = undefined;     
    this.abrirModalFormulario();   
  }    

  editarContrato(contrato: Contrato) {     
    this.contratoAEditar = contrato;     
    this.abrirModalFormulario();   
  }    

  abrirModalFormulario(): void {     
    this.dialogRef = this.dialog.open(this.formDialogTemplate, {       
      width: '800px',       
      disableClose: true,       
      data: {         
        contrato: this.contratoAEditar       
      }     
    });   
  }    

  cerrarModalFormulario(): void {     
    if (this.dialogRef) {       
      this.dialogRef.close();       
      this.dialogRef = null;     
    }   
  }    

  alGuardar() {     
    this.cerrarModalFormulario();     
    // Properly refresh the list of contracts using ViewChild
    if (this.contratosListComponent) {
      this.contratosListComponent.cargarContratos();
    }
  }      

  cancelarFormulario(): void {     
    this.cerrarModalFormulario();   
  } 
}