import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, happyOutline } from 'ionicons/icons';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { NgIf } from '@angular/common';


/**
 * RegisterPage Component
 * 
 * Handles new user registration functionality using Firebase Authentication
 */
@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, NgIf]
})
export class RegisterPage {
  // Inject Firebase Authentication service
  private auth: Auth = inject(Auth);
  // Inject Router for navigation after registration
  private router: Router = inject(Router);

  // Form input for user email
  email: string = '';
  // Form input for user password
  password: string = '';
  // Toggle for password visibility
  showPassword: boolean = false;
  // Flag to track registration in progress
  isLoading: boolean = false;
  // Store error messages for display to the user
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
   * Handles user registration
   * 
   * Validates input fields, attempts to register the user with Firebase Authentication,
   * and navigates to the home page upon successful registration.
   */
  async onRegister() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Inform user about verification email
    this.router.navigate(['/verification-sent'], { 
      queryParams: { email: this.email } 
    });

    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          this.errorMessage = 'Failed to register. Please try again';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
