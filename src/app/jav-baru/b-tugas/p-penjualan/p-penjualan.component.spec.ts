import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPenjualanComponent } from './p-penjualan.component';

describe('PPenjualanComponent', () => {
  let component: PPenjualanComponent;
  let fixture: ComponentFixture<PPenjualanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPenjualanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
