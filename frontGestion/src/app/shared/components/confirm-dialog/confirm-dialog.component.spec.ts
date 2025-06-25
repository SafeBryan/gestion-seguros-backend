import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const mockDialogData = {
    title: '¿Estás seguro?',
    message: 'Esta acción no se puede deshacer.',
    confirmText: 'Sí, continuar',
    cancelText: 'Cancelar',
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar los textos correctamente', () => {
    const titleEl = fixture.debugElement.query(By.css('h2')).nativeElement;
    const messageEl = fixture.debugElement.query(
      By.css('mat-dialog-content')
    ).nativeElement;
    const cancelBtn = fixture.debugElement.query(
      By.css('button[mat-button]')
    ).nativeElement;
    const confirmBtn = fixture.debugElement.query(
      By.css('button[mat-raised-button]')
    ).nativeElement;

    expect(titleEl.textContent).toContain(mockDialogData.title);
    expect(messageEl.textContent).toContain(mockDialogData.message);
    expect(cancelBtn.textContent).toContain(mockDialogData.cancelText);
    expect(confirmBtn.textContent).toContain(mockDialogData.confirmText);
  });
});
