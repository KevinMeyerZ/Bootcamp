import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TRegisterComponent } from './t-register.component';

describe('TRegisterComponent', () => {
  let component: TRegisterComponent;
  let fixture: ComponentFixture<TRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
