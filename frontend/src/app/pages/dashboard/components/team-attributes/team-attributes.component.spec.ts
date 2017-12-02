import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAttributesComponent } from './team-attributes.component';

describe('TeamAttributesComponent', () => {
  let component: TeamAttributesComponent;
  let fixture: ComponentFixture<TeamAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
