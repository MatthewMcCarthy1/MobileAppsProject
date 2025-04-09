import { Component, inject } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { happyOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, NgIf],
})
export class LoginPage {
  private auth: Auth = inject(Auth); // This provides Firebase Auth services
  private router: Router = inject(Router);

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor() {
    addIcons({ happyOutline, eyeOutline, eyeOffOutline });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,  // The auth instance is used here to authenticate
        this.email,
        this.password
      );
      console.log('Logged in user:', userCredential.user);
      this.router.navigate(['/tabs/home']); 
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Invalid email address';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Incorrect password';
          break;
        default:
          this.errorMessage = 'Failed to login. Please try again';
          console.error('Login error:', error);
      }
    } finally {
      this.isLoading = false;
    }
  }
}
