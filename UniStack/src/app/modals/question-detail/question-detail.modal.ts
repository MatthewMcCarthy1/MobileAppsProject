import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { Auth } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { personCircleOutline, timeOutline, closeOutline, chatboxOutline, chevronDownOutline, sendOutline, trashOutline, ellipsisHorizontal } from 'ionicons/icons';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.modal.html',
  styleUrls: ['./question-detail.modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuestionDetailModal implements OnInit {
  question: any;
  answerText: string = '';
  isSubmitting: boolean = false;
  isAnswerFormExpanded: boolean = false;
  
  constructor(
    private modalCtrl: ModalController,
    private questionService: QuestionService,
    private toastController: ToastController,
    private alertController: AlertController,
    private auth: Auth,
    private navParams: NavParams
  ) {
    this.question = this.navParams.get('question');
    addIcons({ 
      personCircleOutline, 
      timeOutline, 
      closeOutline, 
      chatboxOutline, 
      chevronDownOutline, 
      sendOutline,
      trashOutline,
      ellipsisHorizontal
    });
  }

  ngOnInit() {
    this.loadAnswers();
  }

  loadAnswers() {
    if (this.question && this.question.id) {
      this.questionService.getAnswers(this.question.id).subscribe(answers => {
        this.question.answers = answers;
      });
    }
  }

  formatDate(timestamp: any) {
    if (!timestamp) return null;
    
    // Convert Firebase Timestamp to Date
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    
    return timestamp;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
  
  toggleAnswerForm() {
    // Check if user is logged in before expanding form
    if (!this.isAnswerFormExpanded && !this.auth.currentUser) {
      this.presentAlert('Authentication Required', 'Please log in to post an answer.');
      return;
    }
    
    this.isAnswerFormExpanded = !this.isAnswerFormExpanded;
  }

  async submitAnswer() {
    // Check if user is logged in
    if (!this.auth.currentUser) {
      this.presentAlert('Authentication Required', 'Please log in to post an answer.');
      return;
    }
    
    // Validate input
    if (!this.answerText || !this.answerText.trim()) {
      this.presentToast('Please write an answer before submitting', 'danger');
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      await this.questionService.addAnswer(
        this.question.id, 
        this.answerText.trim()
      );
      
      // Reset form
      this.answerText = '';
      this.isAnswerFormExpanded = false; // Collapse the form after successful submission
      await this.presentToast('Answer posted successfully!', 'success');
    } catch (error: any) {
      console.error('Error posting answer:', error);
      this.presentAlert(
        'Error Posting Answer', 
        error.message || 'Failed to post answer. Please try again.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  isCurrentUserAuthor(userId: string): boolean {
    return !!this.auth.currentUser && this.auth.currentUser.uid === userId;
  }

  async confirmDeleteAnswer(answer: any) {
    const alert = await this.alertController.create({
      header: 'Delete Answer',
      message: 'Are you sure you want to delete this answer?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteAnswer(answer)
        }
      ]
    });

    await alert.present();
  }

  async deleteAnswer(answer: any) {
    try {
      await this.questionService.deleteAnswer(this.question.id, answer.id);
      // Update the local array to reflect the deletion immediately
      this.question.answers = this.question.answers.filter((a: any) => a.id !== answer.id);
      this.presentToast('Answer deleted successfully', 'success');
    } catch (error: any) {
      this.presentAlert('Error', error.message || 'Failed to delete answer');
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
