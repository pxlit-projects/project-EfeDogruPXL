import { Routes } from '@angular/router';
import { PostsComponent } from './pages/posts-page/posts.component'; 
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component'; 
import { DraftsPageComponent } from './pages/drafts-page/drafts-page.component';
import { UpdatePostComponent } from './pages/update-post/update-post.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RejectedPostsPageComponent } from './pages/rejected-posts-page/rejected-posts-page.component';
import { PostsUserPageComponent } from './pages/posts-user-page/posts-user-page.component';
import { EditorGuard } from './shared/auth/editor.guard';
import { UserGuard } from './shared/auth/user.guard';
import { CommentsPageComponent } from './pages/comments-page/comments-page.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'posts-editor', component: PostsComponent, canActivate: [EditorGuard] }, 
  { path: 'create-post', component: CreatePostPageComponent, canActivate: [EditorGuard] },
  { path: 'drafts', component: DraftsPageComponent, canActivate: [EditorGuard] },
  { path: 'update-post/:id', component: UpdatePostComponent, canActivate: [EditorGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'rejected', component: RejectedPostsPageComponent, canActivate: [EditorGuard] },
  { path: 'posts', component: PostsUserPageComponent, canActivate: [UserGuard] },
  { path: 'comments/:postId', component: CommentsPageComponent, canActivate: [UserGuard] }
];
