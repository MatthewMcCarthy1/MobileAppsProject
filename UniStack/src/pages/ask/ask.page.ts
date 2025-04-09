import { Component } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../app/services/question.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-ask',
  templateUrl: 'ask.page.html',
  styleUrls: ['ask.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]  
})
export class AskPage {
  question = {
    title: '',
    body: ''
  };
  isSubmitting = false;

  constructor(
    private questionService: QuestionService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private auth: Auth
  ) {}

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
  
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
