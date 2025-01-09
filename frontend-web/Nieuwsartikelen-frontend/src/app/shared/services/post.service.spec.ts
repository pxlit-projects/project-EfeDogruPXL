import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { PostRequest, PostResponse } from '../models/post.model';
import { Notification } from '../models/notification.model';
import { environment } from '../../environments/environment.development';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  const baseUrl = environment.baseUrl + '/post/api/post';

  const mockPost: PostResponse = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'testUser',
    createdAt: '2024-01-09T12:00:00Z',
    isDraft: false,
    status: 'APPROVED',
    reviewContent: '',
    reviewAuthor: ''
  };

  const mockPostRequest: PostRequest = {
    title: 'Test Post',
    content: 'Test Content',
    author: 'testUser',
    isDraft: false
  };

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser', 'getRole']);
    authServiceMock.getUser.and.returnValue('testUser');
    authServiceMock.getRole.and.returnValue('EDITOR');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create proper headers with auth info', () => {
    service.getPostById(1).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush({});
  });

  it('should get approved and pending posts', () => {
    const mockPosts: PostResponse[] = [mockPost];
    
    service.getApprovedAndPendingPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${baseUrl}/all/approved-pending`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush(mockPosts);
  });

  it('should get rejected posts', () => {
    const mockPosts: PostResponse[] = [mockPost];
    
    service.getRejectedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${baseUrl}/all/rejected`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush(mockPosts);
  });

  it('should get approved posts', () => {
    const mockPosts: PostResponse[] = [mockPost];
    
    service.getApprovedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${baseUrl}/all/approved`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush(mockPosts);
  });

  it('should get post by id', () => {
    service.getPostById(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush(mockPost);
  });

  it('should handle error when getting post by invalid id', () => {
    service.getPostById(-1).subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/-1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should get all drafts', () => {
    const mockPosts: PostResponse[] = [mockPost];
    
    service.getAllDrafts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${baseUrl}/all/drafted`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush(mockPosts);
  });

  it('should create post', () => {
    service.createPost(mockPostRequest).subscribe(() => {
      // Verify the request was made successfully
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    expect(req.request.body).toEqual(mockPostRequest);
    req.flush({});
  });

  it('should handle error when creating post with empty title', () => {
    const invalidPost = { ...mockPostRequest, title: '' };
    
    service.createPost(invalidPost).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('should update post', () => {
    service.updatePost(1, mockPostRequest).subscribe(() => {
      // Verify the request was made successfully
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    expect(req.request.body).toEqual(mockPostRequest);
    req.flush({});
  });

  it('should handle error when updating non-existent post', () => {
    service.updatePost(999, mockPostRequest).subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/999`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should get notifications by author', () => {
    const mockNotifications: Notification[] = [{
      id: 1,
      author: 'testUser',
      message: 'Test notification',
      createdAt: '2024-01-09T12:00:00Z'
    }];
    const author = 'testUser';
    
    service.getNotificationsByAuthor(author).subscribe(notifications => {
      expect(notifications).toEqual(mockNotifications);
    });

    const req = httpMock.expectOne(`${baseUrl}/${author}/notification`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush(mockNotifications);
  });

  it('should handle error when getting notifications for non-existent author', () => {
    service.getNotificationsByAuthor('nonexistent').subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/nonexistent/notification`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle unauthorized access', () => {
    authServiceMock.getRole.and.returnValue('');
    
    service.getApprovedPosts().subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/all/approved`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle server errors', () => {
    service.getApprovedPosts().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/all/approved`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network errors', () => {
    service.getApprovedPosts().subscribe({
      error: (error) => {
        expect(error.status).toBe(0);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/all/approved`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle missing user', () => {
    authServiceMock.getUser.and.returnValue('');
    
    service.getApprovedPosts().subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/all/approved`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle invalid role', () => {
    authServiceMock.getRole.and.returnValue('INVALID_ROLE');
    
    service.getApprovedPosts().subscribe({
      error: (error) => {
        expect(error.status).toBe(403);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/all/approved`);
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });
});
