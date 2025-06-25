import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of, isObservable } from 'rxjs';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeMock: ActivatedRouteSnapshot;
  let stateMock: RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    routeMock = {} as ActivatedRouteSnapshot;
    stateMock = {} as RouterStateSnapshot;
  });

  it('should allow access when user is logged in', (done) => {
    authServiceSpy.isLoggedIn.and.returnValue(of(true));

    const result = TestBed.runInInjectionContext(() =>
      authGuard(routeMock, stateMock)
    );

    if (isObservable(result)) {
      result.subscribe((value: unknown) => {
        expect(value).toBeTrue();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    }
  });

  it('should deny access and navigate to login when user is not logged in', (done) => {
    authServiceSpy.isLoggedIn.and.returnValue(of(false));

    const result = TestBed.runInInjectionContext(() =>
      authGuard(routeMock, stateMock)
    );

    if (isObservable(result)) {
      result.subscribe((value: unknown) => {
        expect(value).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    }
  });
});
