import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, happyOutline } from 'ionicons/icons';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon]
})
export class RegisterPage {
  private auth: Auth = inject(Auth);
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
      console.log('Registered user:', userCredential.user);
      this.router.navigate(['/tabs/home']);  
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
          console.error('Registration error:', error);
      }
    } finally {
      this.isLoading = false;
    }
  }
}
