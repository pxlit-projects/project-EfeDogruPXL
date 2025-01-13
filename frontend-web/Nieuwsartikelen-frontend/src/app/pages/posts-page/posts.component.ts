import { Component, inject } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { PostResponse } from '../../shared/models/post.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../shared/services/review.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, MenuBarComponent, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  reviewService: ReviewService = inject(ReviewService);

  posts: PostResponse[] = [];
  loading = true;
  error: string | null = null;
  showTextBox: boolean = false;
  rejectionReason: string = '';

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getApprovedAndPendingPosts().subscribe({
      next: (posts) => {
        console.log(posts);
        this.posts = posts.map(post => ({
          ...post,
          showRejectTextBox: false,  
          rejectionReason: ''
        }));
      },
      error: (error) => {
        this.error = 'Failed to load posts.'; 
        console.error('Error loading posts:', error);
      },
      complete: () => {
        this.loading = false; 
      },
    });
  }

  approvePost(postId: number): void {
    const storedName = localStorage.getItem('name');
  
    const reviewRequest = {
      content: '',
      author: storedName ? storedName : 'Anonymous',
      isApproved: true
    };
  
    this.reviewService.makeReview(postId, reviewRequest).subscribe({
      next: () => {
        console.log(`Post ${postId} approved.`);
        this.getAllPosts();
      },
      error: (error) => {
        console.error('Error approving post:', error);
      }
    });
    
    
  }

  toggleRejectTextBox(post: PostResponse): void {
    post.showRejectTextBox = !post.showRejectTextBox;
  }
  
  rejectPost(post: PostResponse): void {
    const storedName = localStorage.getItem('name');
  
    const reviewRequest = {
      content: post.rejectionReason || '',
      author: storedName ? storedName : 'Anonymous',
      isApproved: false
    };
  
    this.reviewService.makeReview(post.id, reviewRequest).subscribe(() => {
      console.log(`Post ${post.id} rejected.`);
      this.getAllPosts();
    });
  }

  checkUser(author: string): boolean {
    return this.authService.getUser() ===  author;
  }
  
  navigateToCreatePost(): void {
    this.router.navigate(['/create-post']);
  }

  navigateToUpdatePost(id: number): void {
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        if (this.authService.getUser() === post.author && post.status !== 'APPROVED') {
          this.router.navigate(['/update-post', id]);
        }

      },
      error: (err) => {
        console.error(`Error getting review for post ${id}:`, err);
      },
    });
  }

}
