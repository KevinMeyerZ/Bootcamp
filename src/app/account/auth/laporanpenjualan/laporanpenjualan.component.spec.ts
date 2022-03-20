import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanpenjualanComponent } from './laporanpenjualan.component';

describe('LaporanpenjualanComponent', () => {
  let component: LaporanpenjualanComponent;
  let fixture: ComponentFixture<LaporanpenjualanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanpenjualanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanpenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
