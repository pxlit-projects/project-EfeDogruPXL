import { Component, inject } from '@angular/core';
import { PostService} from '../../shared/services/post.service';
import { PostRequest } from '../../shared/models/post.model';
import { FormsModule } from '@angular/forms';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-post-page',
  standalone: true,
  imports: [FormsModule, MenuBarComponent],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.css'
})
export class CreatePostPageComponent {
postService: PostService = inject(PostService);
router: Router = inject(Router);

  post: PostRequest = {
    title: '',
    content: '',
    author: '', 
    isDraft: false,
  };

  ngOnInit(): void {
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
