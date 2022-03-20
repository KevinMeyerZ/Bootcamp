import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PMenuComponent } from './p-menu.component';

describe('PMenuComponent', () => {
  let component: PMenuComponent;
  let fixture: ComponentFixture<PMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
