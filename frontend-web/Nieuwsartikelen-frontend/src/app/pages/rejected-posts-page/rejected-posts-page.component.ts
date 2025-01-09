import { Component, inject } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { PostResponse } from '../../shared/models/post.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { ReviewService } from '../../shared/services/review.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-rejected-posts-page',
  standalone: true,
  imports: [CommonModule, MenuBarComponent],
  templateUrl: './rejected-posts-page.component.html',
  styleUrl: './rejected-posts-page.component.css'
})
export class RejectedPostsPageComponent {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  reviewService: ReviewService = inject(ReviewService);

  posts: PostResponse[] = [];

  ngOnInit(): void {
    this.getRejectedPosts();
  }

  getRejectedPosts(): void {
    this.postService.getRejectedPosts().subscribe({
      next: (posts) => {
        console.log(posts);
        this.posts = posts;

        this.posts.forEach((post) => {
          this.getReviewForPost(post);
        });
      },
      error: (error) => {
        console.error('Error loading rejected posts:', error);
      }
    });
  }

  getReviewForPost(post: PostResponse): void {
    this.reviewService.getReviewByPostId(post.id).subscribe({
      next: (review) => {
        post.reviewAuthor = review.author;
        post.reviewContent = review.content;
      },
      error: (err) => {
        console.error(`Error getting review for post ${post.id}:`, err);
      },
    });
  }

  navigateToUpdatePost(postId: number): void {
    this.reviewService.getReviewByPostId(postId).subscribe({
      next: (review) => {
          this.router.navigate(['/update-post', postId]);

      },
      error: (err) => {
        console.error(`Error getting review for post ${postId}:`, err);
      },
    });
    
  }

  checkUser(author: string): boolean {
    return this.authService.getUser() ===  author;
  }
  
}
