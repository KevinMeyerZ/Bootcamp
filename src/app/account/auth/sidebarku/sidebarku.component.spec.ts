import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarkuComponent } from './sidebarku.component';

describe('SidebarkuComponent', () => {
  let component: SidebarkuComponent;
  let fixture: ComponentFixture<SidebarkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
