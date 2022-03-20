import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanPenjualanComponent } from './laporan-penjualan.component';

describe('LaporanPenjualanComponent', () => {
  let component: LaporanPenjualanComponent;
  let fixture: ComponentFixture<LaporanPenjualanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanPenjualanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanPenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
