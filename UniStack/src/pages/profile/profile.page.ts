import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { personCircleOutline, camera } from 'ionicons/icons';

/**
 * ProfilePage Component
 * 
 * Handles user profile management, including profile picture and logout functionality
 */
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
  
  /**
   * Handles user logout
   * Signs out the user and redirects to the landing page
   */
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

  /**
   * Changes the user's profile picture
   * Opens the device camera or photo gallery to select an image
   */
  async changeProfilePicture() {
    try {
      // Open the device camera or photo gallery to select an image
      const image = await Camera.getPhoto({
        quality: 90,          // Set the image quality to 90%
        allowEditing: true,   // Allow the user to crop/edit the image
        resultType: CameraResultType.DataUrl, // Get image as base64 data URL
        source: CameraSource.Prompt  // Let the user choose camera or gallery
      });
      
      // Store the captured image data URL as profile picture
      // (??) ensures we set null if dataUrl is undefined
      this.profileImage = image.dataUrl ?? null;
    } catch (error) {
      console.error('Camera error:', error);
    }
  }
}
