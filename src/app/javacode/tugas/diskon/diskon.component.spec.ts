import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskonComponent } from './diskon.component';

describe('DiskonComponent', () => {
  let component: DiskonComponent;
  let fixture: ComponentFixture<DiskonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiskonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
