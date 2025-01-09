import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { ReviewRequest, ReviewResponse } from '../models/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  const baseUrl = environment.baseUrl + '/review/api/review';

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser', 'getRole']);
    authServiceMock.getUser.and.returnValue('testUser');
    authServiceMock.getRole.and.returnValue('EDITOR');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create proper headers with auth info', () => {
    service.makeReview(1, { content: 'test', author: 'testUser', isApproved: true });
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    req.flush(null);
  });

  it('should make a review with approval', () => {
    const postId = 1;
    const reviewRequest: ReviewRequest = {
      content: 'Test comment',
      author: 'testUser',
      isApproved: true
    };

    service.makeReview(postId, reviewRequest).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${postId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');
    expect(req.request.body).toEqual(reviewRequest);

    req.flush(null);
  });

  it('should make a review with rejection', () => {
    const postId = 1;
    const reviewRequest: ReviewRequest = {
      content: 'Rejection reason',
      author: 'testUser',
      isApproved: false
    };

    service.makeReview(postId, reviewRequest).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${postId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reviewRequest);

    req.flush(null);
  });

  it('should get review by post id', () => {
    const postId = 1;
    const mockResponse: ReviewResponse = {
      content: 'Test comment',
      postId: 1,
      author: 'testUser',
      isApproved: true
    };

    service.getReviewByPostId(postId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${postId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('name')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('EDITOR');

    req.flush(mockResponse);
  });

  it('should handle error when getting review', () => {
    const postId = 1;
    const errorMessage = 'Review not found';

    service.getReviewByPostId(postId).subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/${postId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
