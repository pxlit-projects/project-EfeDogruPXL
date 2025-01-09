import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsUserPageComponent } from './posts-user-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../shared/services/post.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostResponse } from '../../shared/models/post.model';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';

describe('PostsUserPageComponent', () => {
  let component: PostsUserPageComponent;
  let fixture: ComponentFixture<PostsUserPageComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockPosts: PostResponse[] = [
    {
      id: 1,
      title: 'Test Post 1',
      content: 'Test Content 1',
      author: 'testUser',
      createdAt: '2024-01-09T12:00:00Z',
      isDraft: false,
      status: 'APPROVED',
      reviewContent: '',
      reviewAuthor: ''
    },
    {
      id: 2,
      title: 'Test Post 2',
      content: 'Test Content 2',
      author: 'otherUser',
      createdAt: '2024-01-10T12:00:00Z',
      isDraft: false,
      status: 'APPROVED',
      reviewContent: '',
      reviewAuthor: ''
    }
  ];

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['getApprovedPosts']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        PostsUserPageComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        MenuBarComponent
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsUserPageComponent);
    component = fixture.componentInstance;
    
    // Setup default mock returns
    postServiceMock.getApprovedPosts.and.returnValue(of(mockPosts));
    authServiceMock.getUser.and.returnValue('testUser');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load approved posts on init', () => {
    component.ngOnInit();
    
    expect(postServiceMock.getApprovedPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPosts);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading posts', () => {
    postServiceMock.getApprovedPosts.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalled();
    expect(component.error).toBe('Failed to load posts.');
    expect(component.loading).toBeFalse();
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.posts = mockPosts;
    });

    it('should filter posts by author', () => {
      component.filters.author = 'testUser';
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].author).toBe('testUser');
    });

    it('should filter posts by content', () => {
      component.filters.content = 'Content 1';
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].content).toContain('Content 1');
    });

    it('should filter posts by date', () => {
      component.filters.datetime = '2024-01-09';
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].createdAt).toContain('2024-01-09');
    });

    it('should handle case-insensitive filtering', () => {
      component.filters.author = 'TESTUSER';
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].author.toLowerCase()).toBe('testuser');
    });

    it('should handle partial matches in content filter', () => {
      component.filters.content = 'Content';
      
      expect(component.filteredPosts.length).toBe(2);
    });

    it('should handle empty filters', () => {
      component.filters = { author: '', content: '', datetime: '' };
      
      expect(component.filteredPosts.length).toBe(2);
    });

    it('should handle no matches', () => {
      component.filters.author = 'nonexistent';
      
      expect(component.filteredPosts.length).toBe(0);
    });

    it('should handle multiple filters', () => {
      component.filters = {
        author: 'testUser',
        content: 'Content 1',
        datetime: '2024-01-09'
      };
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].author).toBe('testUser');
      expect(component.filteredPosts[0].content).toContain('Content 1');
    });

    it('should handle whitespace in filters', () => {
      component.filters.author = '  testUser  ';
      
      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].author).toBe('testUser');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty post data', () => {
      postServiceMock.getApprovedPosts.and.returnValue(of([]));
      
      component.ngOnInit();
      
      expect(component.posts).toEqual([]);
      expect(component.loading).toBeFalse();
    });

    it('should handle network errors', () => {
      postServiceMock.getApprovedPosts.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      
      component.ngOnInit();
      
      expect(component.error).toBe('Failed to load posts.');
      expect(component.loading).toBeFalse();
    });

    it('should handle server errors', () => {
      postServiceMock.getApprovedPosts.and.returnValue(
        throwError(() => new Error('Server error'))
      );
      
      component.ngOnInit();
      
      expect(component.error).toBe('Failed to load posts.');
      expect(component.loading).toBeFalse();
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
      postServiceMock.getApprovedPosts.and.returnValue(throwError(() => new Error('Test error')));
      
      component.ngOnInit();
      
      expect(component.loading).toBeFalse();
    });
  });

  describe('Filter Edge Cases', () => {
    beforeEach(() => {
      component.posts = mockPosts;
    });

    it('should handle special characters in filters', () => {
      component.filters.content = '!@#$%^&*()';
      expect(component.filteredPosts.length).toBe(0);
    });

    it('should handle very long filter strings', () => {
      component.filters.author = 'a'.repeat(1000);
      expect(component.filteredPosts.length).toBe(0);
    });

    it('should handle invalid date format', () => {
      component.filters.datetime = 'invalid-date';
      expect(component.filteredPosts.length).toBe(0);
    });

    it('should handle future dates', () => {
      component.filters.datetime = '2025-12-31';
      expect(component.filteredPosts.length).toBe(0);
    });
  });
});
