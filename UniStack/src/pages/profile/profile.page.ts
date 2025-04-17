import { Component, inject } from '@angular/core';
import { IonContent, IonIcon, IonHeader, IonToolbar, IonTitle, ActionSheetController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { personCircleOutline, camera, images, closeCircle } from 'ionicons/icons';

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
  imports: [IonContent, IonIcon, IonHeader, IonToolbar, IonTitle, CommonModule] 
})
export class ProfilePage {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private actionSheetCtrl: ActionSheetController = inject(ActionSheetController);
  isLoading: boolean = false;
  profileImage: string | null = null;

  constructor() {
    addIcons({ personCircleOutline, camera, images, closeCircle });
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
   * Shows options to take a new photo or select from gallery
   */
  async changeProfilePicture() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Change Profile Picture',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => {
            this.getPicture(CameraSource.Camera);
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'images',
          handler: () => {
            this.getPicture(CameraSource.Photos);
          }
        },
        {
          text: 'Cancel',
          icon: 'close-circle',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Gets a picture from the specified source
   * @param source Camera source (Camera or Photos)
   */
  private async getPicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source
      });
      
      this.profileImage = image.dataUrl ?? null;
    } catch (error) {
      console.error('Camera error:', error);
    }
  }
}
