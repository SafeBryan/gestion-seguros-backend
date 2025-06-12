import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReembolsoCrearComponent } from './reembolso-crear.component';

describe('ReembolsoCrearComponent', () => {
  let component: ReembolsoCrearComponent;
  let fixture: ComponentFixture<ReembolsoCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReembolsoCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReembolsoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
