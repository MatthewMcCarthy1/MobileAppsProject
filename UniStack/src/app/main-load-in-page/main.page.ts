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
  private router = inject(Router);

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
