import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonContent, IonTextarea, IonInput, ToastController, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../app/services/question.service';
import { Auth } from '@angular/fire/auth';

/**
 * AskPage Component
 * 
 * Provides an interface for users to submit new questions
 */
@Component({
  selector: 'app-ask',
  templateUrl: 'ask.page.html',
  styleUrls: ['ask.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonContent, IonTextarea, IonInput, CommonModule, FormsModule]  
})
export class AskPage {
  // Question object to store form input data
  question = {
    title: '',
    body: ''
  };
  // Flag to track submission state and prevent multiple submissions
  isSubmitting = false;

  /**
   * Constructor injects required services
   * @param questionService - Service for adding questions to the database
   * @param toastController - Service for displaying toast notifications
   * @param alertController - Service for displaying alert dialogs
   * @param router - Service for navigation between pages
   * @param auth - Firebase authentication service
   */
  constructor(
    private questionService: QuestionService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private auth: Auth
  ) {}

  /**
   * Submits a new question to the platform
   * Validates input, checks authentication, and interacts with the QuestionService
   */
  async submitQuestion() {
    // Check if user is logged in
    if (!this.auth.currentUser) {
      this.presentAlert('Authentication Required', 'Please log in to post a question.');
      return;
    }
    
    // Validate form
    if (!this.question.title || !this.question.title.trim()) {
      this.presentToast('Please enter a question title', 'danger');
      return;
    }
    
    if (!this.question.body || !this.question.body.trim()) {
      this.presentToast('Please provide details for your question', 'danger');
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      // Add question to the database
      await this.questionService.addQuestion(
        this.question.title.trim(), 
        this.question.body.trim()
      );
      
      // Reset form
      this.question = { title: '', body: '' };
      await this.presentToast('Question posted successfully!', 'success');
      this.router.navigate(['/tabs/home']);
    } catch (error: any) {
      console.error('Error posting question:', error);
      this.presentAlert(
        'Error Posting Question', 
        error.message || 'Failed to post question. Please try again.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }
  
  /**
   * Displays a toast notification
   * @param message - Message to display
   * @param color - Color of the toast ('success' or 'danger')
   */
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
  
  /**
   * Displays an alert dialog
   * @param header - Header text for the alert
   * @param message - Message to display in the alert
   */
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
