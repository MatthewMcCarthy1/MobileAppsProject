import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
  imports: [IonContent],
})
export class MainPage {
  private auth = inject(Auth); // Use Angular's inject function
}
