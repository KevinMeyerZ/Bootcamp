import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanCustomerComponent } from './laporan-customer.component';

describe('LaporanCustomerComponent', () => {
  let component: LaporanCustomerComponent;
  let fixture: ComponentFixture<LaporanCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
