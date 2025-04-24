import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';

/**
 * VerificationSentPage Component
 * 
 * Displayed after a user registers to inform them about the verification email.
 * This page shows information about the verification process and displays the
 * email address to which the verification link was sent.
 */
@Component({
  selector: 'app-verification-sent',
  template: `
    <!-- Main content container with full screen option -->
    <ion-content [fullscreen]="true">
      <div class="verification-container">
        <!-- Email icon for visual indication -->
        <ion-icon name="mail-outline" class="verification-icon"></ion-icon>
        
        <!-- Page title -->
        <h1>Verify Your Email</h1>
        
        <!-- Verification instructions -->
        <p>We've sent a verification email to:</p>
        <p class="email">{{email}}</p>
        <p>Please check your inbox and click on the verification link to activate your account.</p>
        <p class="note">If you don't see the email, check your spam folder.</p>
        
        <!-- Navigation link back to login -->
        <a routerLink="/login" class="login-link">Return to Login</a>
      </div>
    </ion-content>
  `,
  styleUrls: ['verification-sent.page.scss'],
  standalone: true,
  // Import necessary modules and components
  imports: [CommonModule, IonContent, IonIcon, RouterLink]
})
export class VerificationSentPage implements OnInit {
  /**
   * Stores the user's email address to display in the template
   * This value is retrieved from URL query parameters
   */
  email: string = '';

  /**
   * Constructor for the VerificationSentPage component
   * 
   * @param route - ActivatedRoute service to access URL query parameters
   */
  constructor(private route: ActivatedRoute) {
    // Register the mail icon for use in the template
    addIcons({ mailOutline });
  }

  /**
   * Lifecycle hook that runs when the component initializes
   * Extracts the email address from URL query parameters
   */
  ngOnInit() {
    // Subscribe to query parameters to get the email address
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }
}