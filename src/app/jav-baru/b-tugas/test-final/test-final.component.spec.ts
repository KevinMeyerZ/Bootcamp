import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFinalComponent } from './test-final.component';

describe('TestFinalComponent', () => {
  let component: TestFinalComponent;
  let fixture: ComponentFixture<TestFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
