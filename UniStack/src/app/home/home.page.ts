import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
})
export class HomePage {
  private auth = inject(Auth); // Use Angular's inject function
}
