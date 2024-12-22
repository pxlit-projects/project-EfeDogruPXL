import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService, PostResponse } from '../post.service';
import { PostsComponent } from '../posts-page/posts.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent {
  postResponse: PostResponse = { id: 0, title: '', author: '', content: '', createdAt: '', isDraft: false, status: '', reviewContent: '', reviewAuthor: '' };
  post = { title: '', content: '', author: 'Anonymous', isDraft: false };
  loading = true;
  error: string | null = null;

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {}


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

