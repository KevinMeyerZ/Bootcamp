import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanMenuComponent } from './laporan-menu.component';

describe('LaporanMenuComponent', () => {
  let component: LaporanMenuComponent;
  let fixture: ComponentFixture<LaporanMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
