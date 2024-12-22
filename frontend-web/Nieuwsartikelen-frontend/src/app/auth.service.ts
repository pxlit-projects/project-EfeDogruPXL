import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  name : string = ''
  role : string = ''

  constructor() { this.loadUser(); }

  setUser(username: string, role: string): void {
    this.name = username;
    this.role = role;
    localStorage.setItem('name', username);
    localStorage.setItem('role', role);
  }

  getUser(): string {
    return this.name;
  }

  getRole(): string {
    return this.role;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('name') !== null;
  }

  logout(): void {
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    this.name = '';
    this.role = '';
  }

  loadUser(): void { 
    this.name = localStorage.getItem('name') || '';
    this.role = localStorage.getItem('role') || '';
  }
}
