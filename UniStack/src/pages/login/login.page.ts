import { Component, inject } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { happyOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

/**
 * LoginPage Component
 * 
 * Handles user authentication using Firebase Authentication
 */
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, NgIf, CommonModule],
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
    // Add icons to be used in the component
    addIcons({ happyOutline, eyeOutline, eyeOffOutline });
  }

  /**
   * Toggles the visibility of the password field
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handles the login process
   * 
   * Validates input fields, attempts to log in the user using Firebase Authentication,
   * and navigates to the home page upon successful login. Displays error messages
   * for invalid credentials or other login issues.
   */
  async onLogin() {
    // Check if email and password fields are filled
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    // Set loading state to true
    this.isLoading = true;
    // Clear any previous error messages
    this.errorMessage = '';

    try {
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        this.auth,  // The auth instance is used here to authenticate
        this.email,
        this.password
      );
      console.log('Logged in user:', userCredential.user);
      // Navigate to the home page upon successful login
      this.router.navigate(['/tabs/home']); 
    } catch (error: any) {
      // Handle different error codes and set appropriate error messages
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
      // Reset loading state
      this.isLoading = false;
    }
  }
}
