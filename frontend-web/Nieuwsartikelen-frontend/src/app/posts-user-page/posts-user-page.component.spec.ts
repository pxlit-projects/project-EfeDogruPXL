import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsUserPageComponent } from './posts-user-page.component';

describe('PostsUserPageComponent', () => {
  let component: PostsUserPageComponent;
  let fixture: ComponentFixture<PostsUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsUserPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
