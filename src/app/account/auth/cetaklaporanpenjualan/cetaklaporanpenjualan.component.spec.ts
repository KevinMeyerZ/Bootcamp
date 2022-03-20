import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CetaklaporanpenjualanComponent } from './cetaklaporanpenjualan.component';

describe('CetaklaporanpenjualanComponent', () => {
  let component: CetaklaporanpenjualanComponent;
  let fixture: ComponentFixture<CetaklaporanpenjualanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CetaklaporanpenjualanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CetaklaporanpenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
