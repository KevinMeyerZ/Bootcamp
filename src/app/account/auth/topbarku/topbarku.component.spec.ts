import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarkuComponent } from './topbarku.component';

describe('TopbarkuComponent', () => {
  let component: TopbarkuComponent;
  let fixture: ComponentFixture<TopbarkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
