import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostResponse, PostService } from '../post.service';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-drafts-page',
  standalone: true,
  imports: [MenuBarComponent],
  templateUrl: './drafts-page.component.html',
  styleUrl: './drafts-page.component.css'
})
export class DraftsPageComponent {
  posts: PostResponse[] = [];
  loading = true;
  error: string | null = null;

  constructor(private postService: PostService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.postService.getAllDrafts().subscribe({
      next: (drafts) => {
        this.posts = drafts; 
      },
      error: (error) => {
        this.error = 'Failed to load drafts.'; 
        console.error(error); 
      },
      complete: () => {
        this.loading = false; 
      },
    });
  }

  navigateToUpdatePost(postId: number): void {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        if (this.authService.getUser() === post.author) {
          this.router.navigate(['/update-post', postId]);
        }

      },
      error: (err) => {
        console.error(`Error getting review for post ${postId}:`, err);
      },
    });
  }

}
