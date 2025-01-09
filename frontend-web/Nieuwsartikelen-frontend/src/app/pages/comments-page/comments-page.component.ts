import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';
import { PostResponse } from '../../shared/models/post.model';
import { CommentService } from '../../shared/services/comment.service';
import { CommentResponse } from '../../shared/models/comment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-page.component.html',
  styleUrl: './comments-page.component.css'
})
export class CommentsPageComponent {
  //injections
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  commentService: CommentService = inject(CommentService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  postResponse: PostResponse = { id: 0, title: '', author: '', content: '', createdAt: '', isDraft: false, status: '', reviewContent: '', reviewAuthor: '' };
  comments: CommentResponse[] = [];
  commentText: string = '';
  editingCommentId: number | null = null;

  ngOnInit(): void {
    const postId = this.route.snapshot.params['postId']; 

    this.postService.getPostById(postId).subscribe({
      next: (response) => {
        this.postResponse = {
          ...response,
          createdAt: this.formatDate(response.createdAt),
        };
        console.log('Post with formatted date:', this.postResponse);
      },
      error: (err) => {
        console.error('Error loading post:', err);
      }
    });
    
    this.getComments(postId);

  }

  getComments(postId : number): void {
    this.commentService.getCommentsByPostId(postId).subscribe({
      next: (comments) => {
        this.comments = comments.map((comment) => ({
          ...comment,
          createdAt: this.formatDate(comment.createdAt), 
          
        }));
        console.log('Formatted Comments:', this.comments);
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      },
    });
  }

  addComment(): void {
    const postId = this.route.snapshot.params['postId']; 
    const name = this.authService.getUser();
    const commentRequest = {
      comment: this.commentText,
      author: name,
    };
    this.commentService.createComment(postId, commentRequest).subscribe({
      next: () => {
        console.log('Comment added successfully!');
        this.commentText = '';
        this.getComments(postId);
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        alert('Failed to add comment. Please try again.');
      }
      
    });
  }

  updateComment(commentId: number, commentText: string): void {
    this.commentService.updateComment(commentId, commentText).subscribe({
      next: () => {
        console.log('Comment updated successfully!');
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        alert('Failed to update comment. Please try again.');
      }
    });
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        console.log('Comment deleted successfully!');
          this.getComments(this.route.snapshot.params['postId']);    
        },
      error: (err) => {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment. Please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  checkUser(author: string): boolean {
    console.log('User:', this.authService.getUser(), 'post author:', this.postResponse.author);
    return this.authService.getUser() ===  author;
  }


  goBackToPosts(): void {
    this.router.navigate(['/posts']);
  }

  startEditing(commentId: number): void {
    console.log('Editing comment:', commentId);
    this.commentService.getCommentById(commentId).subscribe({
      next: (comment) => {
        console.log('Loaded comment:', comment);
        this.editingCommentId = comment.id;
      },
      error: (err) => {
        console.error('Error loading comment:', err);
      }
    });
    console.log('Editing comment text:', this.editingCommentId);
  }

  saveComment(comment: CommentResponse): void {
    const updatedText = comment.comment.trim();
    if (updatedText) {
      this.commentService.updateComment(comment.id, updatedText).subscribe({
        next: () => {
          comment.comment = updatedText; 
          this.editingCommentId = null; 
        },
        error: (err) => alert('Failed to update comment. Please try again.'),
      });
    }
  }

  cancelEditing(): void {
    this.editingCommentId = null; 
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A'; 
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  }

}
