import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../shared/services/post.service';
import { PostResponse, Post } from '../../shared/models/post.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  postResponse: PostResponse = { id: 0, title: '', author: '', content: '', createdAt: '', isDraft: false, status: '', reviewContent: '', reviewAuthor: '' };
  post: Post = { title: '', content: '', author: 'Anonymous', isDraft: false };
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id']; 
  
    this.postService.getPostById(postId).subscribe({
      next: (response) => {
        this.postResponse = response; 
  
        this.post.title = this.postResponse.title;
        this.post.content = this.postResponse.content;
        this.post.author = this.postResponse.author;
  
        this.loading = false; 
      },
      error: (err) => {
        this.error = 'Failed to load post.';
        console.error(err);
        this.loading = false; 
      }
    });
  }
  

  onSubmit(): void {

    if (!this.post.title || !this.post.content) {
      alert('Please fill in all required fields.');
      return;
    }

    this.postService.updatePost(this.postResponse.id, this.post).subscribe({
      next: () => {
        alert('Post updated successfully!');
      },
      error: (err) => {
        console.error('Error updating post:', err);
        alert('Failed to update post. Please try again.');
      }
    });
  }
  

  navigateToPosts(): void {
    this.router.navigate(['/posts-editor']);
  }


}

