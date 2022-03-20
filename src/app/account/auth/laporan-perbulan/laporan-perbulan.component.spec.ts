import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanPerbulanComponent } from './laporan-perbulan.component';

describe('LaporanPerbulanComponent', () => {
  let component: LaporanPerbulanComponent;
  let fixture: ComponentFixture<LaporanPerbulanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanPerbulanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanPerbulanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
