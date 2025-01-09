import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';
import { Notification } from '../../shared/models/notification.model';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css'
})
export class MenuBarComponent {
  router:Router = inject(Router);
  authService:AuthService = inject(AuthService);
  postService:PostService = inject(PostService);
  
  isModalOpen = false;
  notifications: Notification[] = [];

  navigateToCreatePost(): void {
    this.router.navigate(['/create-post']);
  }

  navigateToDrafts(): void {
    this.router.navigate(['/drafts']);
  }

  navigateToPosts(): void {
    this.router.navigate(['/posts-editor']);
  }
  
  navigateToRejectedPosts(): void {
    this.router.navigate(['/rejected']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen; 
    if (this.isModalOpen) {
      this.getNotifications();
    }
  }

  closeModal() {
    this.isModalOpen = false; 
  }

  getNotifications(): void {
    this.postService.getNotificationsByAuthor(this.authService.getUser()).subscribe({
      next: (notifications) => {
        this.notifications = notifications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      },
    });
  }



}
