import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HakAksesComponent } from './hak-akses.component';

describe('HakAksesComponent', () => {
  let component: HakAksesComponent;
  let fixture: ComponentFixture<HakAksesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HakAksesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HakAksesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
