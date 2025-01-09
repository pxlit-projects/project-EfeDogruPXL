import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { CommentRequest, CommentResponse } from '../models/comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  const baseUrl = environment.baseUrl + '/comment/api/comment';

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser', 'getRole']);
    authServiceMock.getUser.and.returnValue('testUser');
    authServiceMock.getRole.and.returnValue('EDITOR');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommentService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a comment', () => {
    const postId = 1;
    const comment: CommentRequest = {
      comment: 'Test comment',
      author: 'testUser'
    };

    service.createComment(postId, comment).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${postId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    expect(req.request.body).toEqual(comment);

    req.flush(null);
  });

  it('should get comments by post id', () => {
    const postId = 1;
    const mockComments: CommentResponse[] = [{
      id: 1,
      comment: 'Test comment',
      author: 'testUser',
      createdAt: new Date().toISOString()
    }];

    service.getCommentsByPostId(postId).subscribe(comments => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${baseUrl}/post/${postId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');

    req.flush(mockComments);
  });

  it('should update a comment', () => {
    const commentId = 1;
    const newText = 'Updated comment';

    service.updateComment(commentId, newText).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${commentId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    expect(req.request.body).toBe(newText);

    req.flush(null);
  });

  it('should delete a comment', () => {
    const commentId = 1;

    service.deleteComment(commentId).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${commentId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');

    req.flush(null);
  });

  it('should handle error when getting comments', () => {
    const postId = 1;
    const errorMessage = 'Error fetching comments';

    service.getCommentsByPostId(postId).subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/post/${postId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
