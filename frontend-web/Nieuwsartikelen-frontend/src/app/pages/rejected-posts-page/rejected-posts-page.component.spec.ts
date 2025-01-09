import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedPostsPageComponent } from './rejected-posts-page.component';

describe('RejectedPostsPageComponent', () => {
  let component: RejectedPostsPageComponent;
  let fixture: ComponentFixture<RejectedPostsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedPostsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedPostsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
