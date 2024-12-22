import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PostService, Notification } from '../post.service';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css'
})
export class MenuBarComponent {
  isModalOpen = false;
  notifications: Notification[] = [];

  constructor(private router: Router, private authService: AuthService, private postService: PostService) {}

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
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      },
    });
  }



}
