import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { personCircleOutline, camera } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule] 
})
export class ProfilePage {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  isLoading: boolean = false;
  profileImage: string | null = null;

  constructor() {
    addIcons({ personCircleOutline, camera });
  }
  
  async onLogout() {
    this.isLoading = true;
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async changeProfilePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
      
      this.profileImage = image.dataUrl ?? null;
    } catch (error) {
      console.error('Camera error:', error);
    }
  }
}
