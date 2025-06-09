import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con el formulario inválido', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería marcar el email como inválido si está vacío', () => {
    component.loginForm.setValue({ email: '', password: '1234' });
    expect(component.f['email'].valid).toBeFalse();
    expect(component.f['email'].errors?.['required']).toBeTrue();
  });

  it('debería marcar el email como inválido si tiene formato incorrecto', () => {
    component.loginForm.setValue({ email: 'correo_mal', password: '1234' });
    expect(component.f['email'].valid).toBeFalse();
    expect(component.f['email'].errors?.['email']).toBeTrue();
  });

  it('debería marcar el password como inválido si está vacío', () => {
    component.loginForm.setValue({ email: 'test@mail.com', password: '' });
    expect(component.f['password'].valid).toBeFalse();
    expect(component.f['password'].errors?.['required']).toBeTrue();
  });

  it('no debería llamar al servicio si el formulario es inválido', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('debería ejecutar login y redirigir si las credenciales son correctas', () => {
    const credenciales = { email: 'test@mail.com', password: '1234' };
    authServiceSpy.login.and.returnValue(of({ token: 'mockToken' }));

    component.loginForm.setValue(credenciales);
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(credenciales);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.errorMessage).toBe('');
  });

  it('debería mostrar mensaje de error si el login falla', () => {
    const credenciales = { email: 'fallo@mail.com', password: 'wrongpass' };
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Error')));

    component.loginForm.setValue(credenciales);
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Credenciales incorrectas');
  });

  it('debería exponer los controles del formulario vía getter f()', () => {
    const controls = component.f;
    expect(controls['email']).toBeTruthy();
    expect(controls['password']).toBeTruthy();
  });
});
