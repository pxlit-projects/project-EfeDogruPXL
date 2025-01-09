import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostPageComponent } from './create-post-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PostService } from '../../shared/services/post.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { of, throwError } from 'rxjs';

describe('CreatePostPageComponent', () => {
  let component: CreatePostPageComponent;
  let fixture: ComponentFixture<CreatePostPageComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['createPost']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CreatePostPageComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        MenuBarComponent
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize post with default values', () => {
      expect(component.post).toBeDefined();
      expect(component.post.title).toBe('');
      expect(component.post.content).toBe('');
      expect(component.post.isDraft).toBeFalse();
    });

    it('should set author from localStorage on init', () => {
      const testName = 'TestUser';
      spyOn(localStorage, 'getItem').and.returnValue(testName);
      
      component.ngOnInit();
      
      expect(component.post.author).toBe(testName);
    });

    it('should set author to Anonymous if localStorage is empty', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      
      component.ngOnInit();
      
      expect(component.post.author).toBe('Anonymous');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.post = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
        isDraft: false
      };
    });

    it('should create post successfully', () => {
      postServiceMock.createPost.and.returnValue(of(undefined));
      spyOn(window, 'alert');
      
      component.onSubmit();
      
      expect(postServiceMock.createPost).toHaveBeenCalledWith(component.post);
      expect(window.alert).toHaveBeenCalledWith('Post created successfully!');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/posts-editor']);
    });

    it('should handle error when creating post', () => {
      postServiceMock.createPost.and.returnValue(throwError(() => new Error('Test error')));
      spyOn(window, 'alert');
      spyOn(console, 'error');
      
      component.onSubmit();
      
      expect(postServiceMock.createPost).toHaveBeenCalledWith(component.post);
      expect(window.alert).toHaveBeenCalledWith('Failed to create post. Please try again.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should set isDraft flag correctly', () => {
      component.post.isDraft = true;
      postServiceMock.createPost.and.returnValue(of(undefined));
      
      component.onSubmit();
      
      expect(postServiceMock.createPost).toHaveBeenCalledWith({
        ...component.post,
        isDraft: true
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to posts page', () => {
      component.navigateToPosts();
      
      expect(routerMock.navigate).toHaveBeenCalledWith(['/posts-editor']);
    });
  });
});
