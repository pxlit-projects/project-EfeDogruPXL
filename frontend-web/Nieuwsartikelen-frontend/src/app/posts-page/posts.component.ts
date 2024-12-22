import { Component } from '@angular/core';
import { PostResponse, PostService } from '../post.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../review.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, MenuBarComponent, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  posts: PostResponse[] = [];
  loading = true;
  error: string | null = null;
  showTextBox: boolean = false;
  rejectionReason: string = '';

  constructor(private postService: PostService, private router: Router, private reviewService: ReviewService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getApprovedAndPendingPosts().subscribe({
      next: (posts) => {
        console.log(posts);
        this.posts = posts;
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
        window.location.reload();
      },
      error: (error) => {
        console.error('Error approving post:', error);
      }
    });
    
    
  }

  showRejectTextBox(): void {
    this.showTextBox = !this.showTextBox;
  }
  
  rejectPost(postId: number): void {
    const storedName = localStorage.getItem('name');
  
    const reviewRequest = {
      content: this.rejectionReason,
      author: storedName ? storedName : 'Anonymous',
      isApproved: false
    };
  
    this.reviewService.makeReview(postId, reviewRequest).subscribe(() => {
      console.log(`Post ${postId} rejected.`);
      window.location.reload();
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
