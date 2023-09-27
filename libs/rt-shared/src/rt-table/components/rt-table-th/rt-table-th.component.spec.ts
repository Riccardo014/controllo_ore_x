import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtTableThComponent } from './rt-table-th.component';

describe('RtTableThComponent', () => {
  let component: RtTableThComponent;
  let fixture: ComponentFixture<RtTableThComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RtTableThComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RtTableThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
