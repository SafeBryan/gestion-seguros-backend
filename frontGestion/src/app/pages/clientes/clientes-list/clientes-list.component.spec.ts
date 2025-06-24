import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesListComponent } from './clientes-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ClientesListComponent', () => {
  let component: ClientesListComponent;
  let fixture: ComponentFixture<ClientesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientesListComponent,
        HttpClientTestingModule,
        MatSnackBarModule, // también puede ser necesario para evitar otro error
        BrowserAnimationsModule, // por si usas animaciones en dialogs/snackbar
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
