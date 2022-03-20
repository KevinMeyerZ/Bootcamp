import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TambahMenuComponent } from './tambah-menu.component';

describe('TambahMenuComponent', () => {
  let component: TambahMenuComponent;
  let fixture: ComponentFixture<TambahMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TambahMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TambahMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
