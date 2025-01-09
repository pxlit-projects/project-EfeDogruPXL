import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake(key => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => localStorageMock[key] = value);
    spyOn(localStorage, 'clear').and.callFake(() => localStorageMock = {});

    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    localStorageMock = {}; // Reset mock storage
  });

  afterEach(() => {
    localStorageMock = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get user', () => {
    service.setUser('testUser', 'editor');
    expect(service.getUser()).toBe('testUser');
    expect(service.getRole()).toBe('editor');
    expect(localStorage.setItem).toHaveBeenCalledWith('name', 'testUser');
    expect(localStorage.setItem).toHaveBeenCalledWith('role', 'editor');
  });

  it('should clear user data on logout', () => {
    service.setUser('testUser', 'editor');
    service.logout();
    expect(service.getUser()).toBe('');
    expect(service.getRole()).toBe('');
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should persist user data in localStorage', () => {
    service.setUser('testUser', 'editor');
    expect(localStorage.setItem).toHaveBeenCalledWith('name', 'testUser');
    expect(localStorage.setItem).toHaveBeenCalledWith('role', 'editor');
  });

  it('should retrieve user data from localStorage', () => {
    localStorageMock = { name: 'testUser', role: 'editor' };
    expect(service.getUser()).toBe('testUser');
    expect(service.getRole()).toBe('editor');
    expect(localStorage.getItem).toHaveBeenCalledWith('name');
    expect(localStorage.getItem).toHaveBeenCalledWith('role');
  });

  it('should return empty string when user data is not in localStorage', () => {
    expect(service.getUser()).toBe('');
    expect(service.getRole()).toBe('');
    expect(localStorage.getItem).toHaveBeenCalledWith('name');
    expect(localStorage.getItem).toHaveBeenCalledWith('role');
  });
});
