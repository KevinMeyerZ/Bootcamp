import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PCustomerComponent } from './p-customer.component';

describe('PCustomerComponent', () => {
  let component: PCustomerComponent;
  let fixture: ComponentFixture<PCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
