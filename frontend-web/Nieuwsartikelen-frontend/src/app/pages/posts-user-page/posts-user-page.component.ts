import { Component, inject } from '@angular/core';
import { PostResponse } from '../../shared/models/post.model';
import { Router } from '@angular/router';
import { PostService } from '../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-posts-user-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuBarComponent],
  templateUrl: './posts-user-page.component.html',
  styleUrl: './posts-user-page.component.css'
})
export class PostsUserPageComponent {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  posts: PostResponse[] = [];
  filters = { author: '', content: '', datetime: '' };
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getApprovedPosts().subscribe({
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

  

  get filteredPosts(): PostResponse[] {
    return this.posts.filter(post => {
      return (
        (!this.filters.author || (post.author || '').toLowerCase().includes(this.filters.author.toLowerCase())) &&
        (!this.filters.content || post.content.toLowerCase().includes(this.filters.content.toLowerCase())) &&
        (!this.filters.datetime || new Date(post.createdAt).toISOString().split('T')[0] === this.filters.datetime)
      );
    });
  } 

  clearFilters(): void {
    this.filters = { author: '', content: '', datetime: '' };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToComments(postId: number): void {
    this.router.navigate(['/comments', postId]);
  }

}
