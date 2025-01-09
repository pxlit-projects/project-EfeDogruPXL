import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../shared/services/post.service';
import { PostResponse } from '../../shared/models/post.model';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-drafts-page',
  standalone: true,
  imports: [MenuBarComponent],
  templateUrl: './drafts-page.component.html',
  styleUrl: './drafts-page.component.css'
})
export class DraftsPageComponent {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  posts: PostResponse[] = [];
  loading = true;
  error: string | null = null;

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
