import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class MainPage {
  private router = inject(Router); // Inject Router for navigation

  // Navigate to login page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Navigate to register page
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
