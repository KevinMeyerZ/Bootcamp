import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestmcComponent } from './testmc.component';

describe('TestmcComponent', () => {
  let component: TestmcComponent;
  let fixture: ComponentFixture<TestmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
