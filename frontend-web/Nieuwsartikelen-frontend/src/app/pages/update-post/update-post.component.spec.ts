import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePostComponent } from './update-post.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../shared/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostResponse } from '../../shared/models/post.model';

describe('UpdatePostComponent', () => {
  let component: UpdatePostComponent;
  let fixture: ComponentFixture<UpdatePostComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockPost: PostResponse = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'testUser',
    createdAt: new Date().toISOString(),
    isDraft: false,
    status: 'PENDING',
    reviewContent: '',
    reviewAuthor: ''
  };

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['getPostById', 'updatePost']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        UpdatePostComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load post data on init', () => {
  //   postServiceMock.getPostById.and.returnValue(of(mockPost));
    
  //   component.ngOnInit();
    
  //   expect(postServiceMock.getPostById).toHaveBeenCalledWith(1);
  //   expect(component.postResponse).toEqual(mockPost);
  //   expect(component.post.title).toBe(mockPost.title);
  //   expect(component.post.content).toBe(mockPost.content);
  //   expect(component.post.author).toBe(mockPost.author);
  //   expect(component.loading).toBeFalse();
  // });

  it('should handle error when loading post', () => {
    postServiceMock.getPostById.and.returnValue(throwError(() => new Error('Test error')));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Failed to load post.');
    expect(component.loading).toBeFalse();
  });

  it('should update post successfully', () => {
    const updatedPost = {
      title: 'Updated Title',
      content: 'Updated Content',
      author: 'testUser',
      isDraft: false
    };
    
    component.postResponse.id = 1;
    component.post = updatedPost;
    postServiceMock.updatePost.and.returnValue(of(void 0));
    spyOn(window, 'alert');
    
    component.onSubmit();
    
    expect(postServiceMock.updatePost).toHaveBeenCalledWith(1, updatedPost);
    expect(window.alert).toHaveBeenCalledWith('Post updated successfully!');
  });

  // it('should handle error when updating post', () => {
  //   component.postResponse.id = 1;
  //   postServiceMock.updatePost.and.returnValue(throwError(() => new Error('Test error')));
  //   spyOn(window, 'alert');
  //   spyOn(console, 'error');
    
  //   component.onSubmit();
    
  //   expect(console.error).toHaveBeenCalled();
  //   expect(window.alert).toHaveBeenCalledWith('Failed to update post. Please try again.');
  // });

  it('should navigate to posts page', () => {
    component.navigateToPosts();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts-editor']);
  });

  it('should initialize with default values', () => {
    expect(component.loading).toBeTrue();
    expect(component.error).toBeNull();
    expect(component.postResponse).toBeDefined();
    expect(component.post).toBeDefined();
    expect(component.post.author).toBe('Anonymous');
  });
});
