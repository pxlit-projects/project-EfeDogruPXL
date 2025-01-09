import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  loginForm!: FormGroup;

  name : string = ''
  role : string = ''

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return; 
    }

    const { name, role } = this.loginForm.value;
    this.authService.setUser(name, role);
    console.log(name, role);
    if(role === 'editor'){
      this.router.navigate(['/posts-editor']);
    }else{
      this.router.navigate(['/posts']);

    }
  }



}
