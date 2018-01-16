import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NozzelsComponent } from './nozzels.component';

describe('NozzelsComponent', () => {
  let component: NozzelsComponent;
  let fixture: ComponentFixture<NozzelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NozzelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NozzelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
