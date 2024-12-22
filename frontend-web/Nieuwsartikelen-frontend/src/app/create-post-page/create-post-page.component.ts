import { Component } from '@angular/core';
import { PostService, PostRequest } from '../post.service';
import { FormsModule } from '@angular/forms';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-post-page',
  standalone: true,
  imports: [FormsModule, MenuBarComponent],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.css'
})
export class CreatePostPageComponent {
  post: PostRequest = {
    title: '',
    content: '',
    author: '', 
    isDraft: false,
  };

  constructor(private postService: PostService, private router: Router) {
    const storedName = localStorage.getItem('name'); 
    this.post.author = storedName ? storedName : 'Anonymous'; 
  }

  onSubmit(): void {
    this.postService.createPost(this.post).subscribe({
      next: () => {
        alert('Post created successfully!');
        this.router.navigate(['/posts-editor']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
        alert('Failed to create post. Please try again.');
      }
    });
  }

  navigateToPosts(): void {
    this.router.navigate(['/posts-editor']);
  }

}
