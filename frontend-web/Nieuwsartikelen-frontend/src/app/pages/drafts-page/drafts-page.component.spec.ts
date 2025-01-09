import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraftsPageComponent } from './drafts-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PostService } from '../../shared/services/post.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostResponse } from '../../shared/models/post.model';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';

describe('DraftsPageComponent', () => {
  let component: DraftsPageComponent;
  let fixture: ComponentFixture<DraftsPageComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockDrafts: PostResponse[] = [
    {
      id: 1,
      title: 'Draft Post 1',
      content: 'Draft Content 1',
      author: 'testUser',
      createdAt: '2024-01-09T12:00:00Z',
      isDraft: true,
      status: 'PENDING',
      reviewContent: '',
      reviewAuthor: ''
    },
    {
      id: 2,
      title: 'Draft Post 2',
      content: 'Draft Content 2',
      author: 'otherUser',
      createdAt: '2024-01-10T12:00:00Z',
      isDraft: true,
      status: 'PENDING',
      reviewContent: '',
      reviewAuthor: ''
    }
  ];

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['getAllDrafts', 'getPostById']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        DraftsPageComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MenuBarComponent
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DraftsPageComponent);
    component = fixture.componentInstance;
    
    // Setup default mock returns
    postServiceMock.getAllDrafts.and.returnValue(of(mockDrafts));
    authServiceMock.getUser.and.returnValue('testUser');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load drafts on init', () => {
    component.ngOnInit();
    
    expect(postServiceMock.getAllDrafts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockDrafts);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle empty drafts', () => {
    postServiceMock.getAllDrafts.and.returnValue(of([]));
    
    component.ngOnInit();
    
    expect(component.posts).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  describe('Error Handling', () => {
    it('should handle error when loading drafts', () => {
      postServiceMock.getAllDrafts.and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');
      
      component.ngOnInit();
      
      expect(console.error).toHaveBeenCalled();
      expect(component.error).toBe('Failed to load drafts.');
      expect(component.loading).toBeFalse();
    });

    it('should handle network errors', () => {
      postServiceMock.getAllDrafts.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      
      component.ngOnInit();
      
      expect(component.error).toBe('Failed to load drafts.');
      expect(component.loading).toBeFalse();
    });

    it('should handle server errors', () => {
      postServiceMock.getAllDrafts.and.returnValue(
        throwError(() => new Error('Server error'))
      );
      
      component.ngOnInit();
      
      expect(component.error).toBe('Failed to load drafts.');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Navigation', () => {
    it('should navigate to update post when user is author', () => {
      const postId = 1;
      postServiceMock.getPostById.and.returnValue(of(mockDrafts[0]));
      
      component.navigateToUpdatePost(postId);
      
      expect(postServiceMock.getPostById).toHaveBeenCalledWith(postId);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/update-post', postId]);
    });

    it('should not navigate to update post when user is not author', () => {
      const postId = 2;
      postServiceMock.getPostById.and.returnValue(of(mockDrafts[1]));
      
      component.navigateToUpdatePost(postId);
      
      expect(postServiceMock.getPostById).toHaveBeenCalledWith(postId);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should handle error when getting post for navigation', () => {
      const postId = 1;
      postServiceMock.getPostById.and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');
      
      component.navigateToUpdatePost(postId);
      
      expect(postServiceMock.getPostById).toHaveBeenCalledWith(postId);
      expect(console.error).toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      expect(component.loading).toBeTrue();
    });

    it('should hide loading state after successful load', () => {
      component.ngOnInit();
      expect(component.loading).toBeFalse();
    });

    it('should hide loading state after error', () => {
      postServiceMock.getAllDrafts.and.returnValue(throwError(() => new Error('Test error')));
      
      component.ngOnInit();
      
      expect(component.loading).toBeFalse();
    });
  });
});
