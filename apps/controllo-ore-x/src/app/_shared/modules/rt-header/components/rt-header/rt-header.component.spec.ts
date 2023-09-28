import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtHeaderComponent } from './rt-header.component';

describe('HeaderComponent', () => {
  let component: RtHeaderComponent;
  let fixture: ComponentFixture<RtHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RtHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RtHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
