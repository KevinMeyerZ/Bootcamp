import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherTambahComponent } from './voucher-tambah.component';

describe('VoucherTambahComponent', () => {
  let component: VoucherTambahComponent;
  let fixture: ComponentFixture<VoucherTambahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherTambahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherTambahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
