import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';
import { ReviewService } from '../../shared/services/review.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let reviewServiceMock: jasmine.SpyObj<ReviewService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser', 'getRole']);
    postServiceMock = jasmine.createSpyObj('PostService', ['getApprovedAndPendingPosts', 'getPostById']);
    reviewServiceMock = jasmine.createSpyObj('ReviewService', ['makeReview']);

    await TestBed.configureTestingModule({
      imports: [
        PostsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: ReviewService, useValue: reviewServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    
    // Setup default mock returns
    authServiceMock.getUser.and.returnValue('testUser');
    authServiceMock.getRole.and.returnValue('EDITOR');
    postServiceMock.getApprovedAndPendingPosts.and.returnValue(of([]));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load posts on init', () => {
  //   const mockPosts = [
  //     {
  //       id: 1,
  //       title: 'Test Post',
  //       content: 'Test Content',
  //       author: 'testUser',
  //       createdAt: new Date().toISOString(),
  //       isDraft: false,
  //       status: 'PENDING',
  //       reviewContent: '',
  //       reviewAuthor: ''
  //     }
  //   ];

  //   postServiceMock.getApprovedAndPendingPosts.and.returnValue(of(mockPosts));
  //   component.ngOnInit();
  //   expect(component.posts).toEqual(mockPosts);
  // });

  it('should handle error when loading posts', () => {
    postServiceMock.getApprovedAndPendingPosts.and.returnValue(throwError(() => new Error('Test error')));
    component.ngOnInit();
    expect(component.error).toBe('Failed to load posts.');
  });
});
