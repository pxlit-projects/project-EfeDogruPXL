import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginForm!: FormGroup;

  name : string = ''
  role : string = ''

  constructor(private fb: FormBuilder, private router : Router, private authService: AuthService) { }

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
