import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewDialogComponent } from './preview-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

describe('PreviewDialogComponent', () => {
  let component: PreviewDialogComponent;
  let fixture: ComponentFixture<PreviewDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PreviewDialogComponent>>;

  const mockData = {
    content: 'ZmFrZS1iYXNlNjQ=', // fake base64
    contentType: 'application/pdf',
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [PreviewDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería generar safeUrl con base64 y contentType', () => {
    const expectedUrl = `data:${mockData.contentType};base64,${mockData.content}`;
    const sanitizer = TestBed.inject(DomSanitizer);
    const expectedSafeUrl =
      sanitizer.bypassSecurityTrustResourceUrl(expectedUrl);

    expect(component.safeUrl).toEqual(expectedSafeUrl);
  });

  it('debería cerrar el diálogo al llamar cerrar()', () => {
    component.cerrar();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
