import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractClientPaymentsComponent } from './contract-client-payments.component';

describe('ContractClientPaymentsComponent', () => {
  let component: ContractClientPaymentsComponent;
  let fixture: ComponentFixture<ContractClientPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractClientPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractClientPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
