import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftsPageComponent } from './drafts-page.component';

describe('DraftsPageComponent', () => {
  let component: DraftsPageComponent;
  let fixture: ComponentFixture<DraftsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
