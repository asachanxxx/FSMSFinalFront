import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfcardsComponent } from './rfcards.component';

describe('RfcardsComponent', () => {
  let component: RfcardsComponent;
  let fixture: ComponentFixture<RfcardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfcardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
