import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../services/auth.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { OverlayContainer } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir toggleSidenav cuando se llame', () => {
    spyOn(component.toggleSidenav, 'emit');
    component.toggleSidenav.emit();
    expect(component.toggleSidenav.emit).toHaveBeenCalled();
  });

  it('debería llamar singOut() al hacer clic en "Cerrar Sesión"', () => {
    spyOn(component, 'singOut').and.callThrough();

    const trigger = fixture.debugElement
      .query(By.directive(MatMenuTrigger))
      .injector.get(MatMenuTrigger);
    trigger.openMenu();
    fixture.detectChanges();

    const logoutButton = overlayContainerElement.querySelector(
      'button[mat-menu-item]'
    );
    expect(logoutButton).toBeTruthy();

    (logoutButton as HTMLElement).click();
    expect(component.singOut).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
