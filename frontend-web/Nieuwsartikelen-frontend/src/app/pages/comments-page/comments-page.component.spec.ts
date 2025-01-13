import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsPageComponent } from './comments-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../shared/services/post.service';
import { CommentService } from '../../shared/services/comment.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostResponse } from '../../shared/models/post.model';
import { CommentResponse } from '../../shared/models/comment.model';

describe('CommentsPageComponent', () => {
  let component: CommentsPageComponent;
  let fixture: ComponentFixture<CommentsPageComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let commentServiceMock: jasmine.SpyObj<CommentService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

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

  const mockComments: CommentResponse[] = [
    {
      id: 1,
      comment: 'Test Comment 1',
      author: 'testUser',
      createdAt: '2024-01-09T12:00:00Z'
    },
    {
      id: 2,
      comment: 'Test Comment 2',
      author: 'otherUser',
      createdAt: '2024-01-09T12:30:00Z'
    }
  ];

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['getPostById']);
    commentServiceMock = jasmine.createSpyObj('CommentService', [
      'getCommentsByPostId',
      'createComment',
      'updateComment',
      'deleteComment',
      'getCommentById'
    ]);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CommentsPageComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: CommentService, useValue: commentServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                postId: '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsPageComponent);
    component = fixture.componentInstance;

    // Setup default mock returns
    postServiceMock.getPostById.and.returnValue(of(mockPost));
    commentServiceMock.getCommentsByPostId.and.returnValue(of(mockComments));
    authServiceMock.getUser.and.returnValue('testUser');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load post and comments on init', () => {
  //   component.ngOnInit();
    
  //   expect(postServiceMock.getPostById).toHaveBeenCalledWith(1);
  //   expect(commentServiceMock.getCommentsByPostId).toHaveBeenCalledWith(1);
  //   expect(component.postResponse.title).toBe(mockPost.title);
  //   expect(component.comments.length).toBe(2);
  // });

  it('should handle error when loading post', () => {
    postServiceMock.getPostById.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle error when loading comments', () => {
    commentServiceMock.getCommentsByPostId.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalled();
  });

  // it('should add comment successfully', () => {
  //   const newComment = { comment: 'New Comment', author: 'testUser' };
  //   component.commentText = newComment.comment;
  //   commentServiceMock.createComment.and.returnValue(of(void 0));
    
  //   component.addComment();
    
  //   expect(commentServiceMock.createComment).toHaveBeenCalledWith(1, newComment);
  //   expect(component.commentText).toBe('');
  //   expect(commentServiceMock.getCommentsByPostId).toHaveBeenCalledWith(1);
  // });

  it('should handle error when adding comment', () => {
    component.commentText = 'New Comment';
    commentServiceMock.createComment.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    spyOn(window, 'alert');
    
    component.addComment();
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to add comment. Please try again.');
  });

  // it('should not add empty or whitespace-only comment', () => {
  //   // Test empty comment
  //   component.commentText = '';
  //   component.addComment();
  //   expect(commentServiceMock.createComment).not.toHaveBeenCalled();

  //   // Test whitespace-only comment
  //   component.commentText = '   ';
  //   component.addComment();
  //   expect(commentServiceMock.createComment).not.toHaveBeenCalled();
  // });

  it('should update comment successfully', () => {
    const commentId = 1;
    const updatedText = 'Updated Comment';
    commentServiceMock.updateComment.and.returnValue(of(void 0));
    spyOn(console, 'log');
    
    component.updateComment(commentId, updatedText);
    
    expect(commentServiceMock.updateComment).toHaveBeenCalledWith(commentId, updatedText);
    expect(console.log).toHaveBeenCalledWith('Comment updated successfully!');
  });

  it('should handle error when updating comment', () => {
    commentServiceMock.updateComment.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    spyOn(window, 'alert');
    
    component.updateComment(1, 'Updated Comment');
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to update comment. Please try again.');
  });

  // it('should delete comment successfully', () => {
  //   const commentId = 1;
  //   commentServiceMock.deleteComment.and.returnValue(of(void 0));
    
  //   component.deleteComment(commentId);
    
  //   expect(commentServiceMock.deleteComment).toHaveBeenCalledWith(commentId);
  //   expect(commentServiceMock.getCommentsByPostId).toHaveBeenCalledWith(1);
  // });

  it('should handle error when deleting comment', () => {
    commentServiceMock.deleteComment.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    spyOn(window, 'alert');
    
    component.deleteComment(1);
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to delete comment. Please try again.');
  });

  // it('should handle date formatting', () => {
  //   // Test valid date
  //   const dateString = '2024-01-09T12:00:00Z';
  //   const formattedDate = component.formatDate(dateString);
  //   expect(formattedDate).toContain('2024');
  //   expect(formattedDate).toContain('Jan');

  //   // Test empty string
  //   expect(component.formatDate('')).toBe('N/A');

  //   // Test invalid date
  //   expect(component.formatDate('invalid-date')).toBe('N/A');

  //   // Test malformed date
  //   expect(component.formatDate('2024-13-45')).toBe('N/A');

  //   // Test edge cases
  //   expect(component.formatDate('0000-01-01T00:00:00Z')).toContain('Jan');
  //   expect(component.formatDate('9999-12-31T23:59:59Z')).toContain('Dec');
  // });

  // it('should handle invalid comment IDs when starting edit', () => {
  //   // Test with 0 (invalid id)
  //   component.startEditing(0);
  //   expect(commentServiceMock.getCommentById).not.toHaveBeenCalled();
    
  //   // Test with negative id
  //   component.startEditing(-1);
  //   expect(commentServiceMock.getCommentById).not.toHaveBeenCalled();
  // });

  // it('should handle route params edge cases', () => {
  //   TestBed.resetTestingModule();
    
  //   TestBed.configureTestingModule({
  //     imports: [
  //       CommentsPageComponent,
  //       HttpClientTestingModule,
  //       RouterTestingModule,
  //       FormsModule
  //     ],
  //     providers: [
  //       { provide: PostService, useValue: postServiceMock },
  //       { provide: CommentService, useValue: commentServiceMock },
  //       { provide: AuthService, useValue: authServiceMock },
  //       { provide: Router, useValue: routerMock },
  //       {
  //         provide: ActivatedRoute,
  //         useValue: {
  //           snapshot: {
  //             params: {
  //               postId: 'invalid'
  //             }
  //           }
  //         }
  //       }
  //     ]
  //   }).compileComponents();

  //   const newFixture = TestBed.createComponent(CommentsPageComponent);
  //   const newComponent = newFixture.componentInstance;
  //   spyOn(console, 'error');
    
  //   newComponent.ngOnInit();
  //   expect(postServiceMock.getPostById).not.toHaveBeenCalled();
  // });

  it('should handle user authorization edge cases', () => {
    // Test with empty string user
    authServiceMock.getUser.and.returnValue('');
    expect(component.checkUser('testUser')).toBeFalse();

    // Test with empty string author
    authServiceMock.getUser.and.returnValue('testUser');
    expect(component.checkUser('')).toBeFalse();

    // Test case sensitivity
    authServiceMock.getUser.and.returnValue('TestUser');
    expect(component.checkUser('testUser')).toBeFalse();

    // Test whitespace
    authServiceMock.getUser.and.returnValue('testUser ');
    expect(component.checkUser('testUser')).toBeFalse();

    // Test special characters
    authServiceMock.getUser.and.returnValue('test@User');
    expect(component.checkUser('testUser')).toBeFalse();
  });

  it('should logout and navigate to login page', () => {
    component.logout();
    
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate back to posts', () => {
    component.goBackToPosts();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle editing operations', () => {
    // Start editing
    const commentId = 1;
    const comment = mockComments[0];
    commentServiceMock.getCommentById.and.returnValue(of(comment));
    
    component.startEditing(commentId);
    expect(commentServiceMock.getCommentById).toHaveBeenCalledWith(commentId);
    expect(component.editingCommentId).toBe(commentId);

    // Cancel editing
    component.cancelEditing();
    expect(component.editingCommentId).toBeNull();

    // Save edited comment
    commentServiceMock.updateComment.and.returnValue(of(void 0));
    component.editingCommentId = 1;
    component.saveComment(comment);
    expect(commentServiceMock.updateComment).toHaveBeenCalledWith(1, comment.comment);
    expect(component.editingCommentId).toBeNull();
  });
});
