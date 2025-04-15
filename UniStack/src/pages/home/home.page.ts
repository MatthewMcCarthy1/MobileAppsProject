import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../app/services/question.service';
import { Question } from '../../app/models/question.model';
import { DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { personCircleOutline, timeOutline, add, trashOutline, ellipsisVertical } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { QuestionDetailModal } from '../../app/modals/question-detail/question-detail.modal';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, DatePipe, RouterLink]
})
export class HomePage implements OnInit {
  searchText: string = '';
  questions: Question[] = [];
  allQuestions: Question[] = [];
  isLoading = true;

  constructor(
    private questionService: QuestionService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private auth: Auth
  ) {
    addIcons({
      personCircleOutline,
      timeOutline,
      add,
      trashOutline,
      ellipsisVertical
    });
  }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.isLoading = true;
    this.questionService.getQuestions().subscribe({
      next: (questions) => {
        this.allQuestions = questions;
        this.questions = [...this.allQuestions];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching questions:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(event: any) {
    this.searchText = event.detail.value || '';
    this.filterQuestions(this.searchText);
  }

  filterQuestions(searchText: string) {
    if (!searchText.trim()) {
      this.questions = [...this.allQuestions];
      return;
    }

    searchText = searchText.toLowerCase().trim();
    this.questions = this.allQuestions.filter(question => {
      return question.title.toLowerCase().includes(searchText) || 
             question.body.toLowerCase().includes(searchText);
    });
  }

  formatDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    return timestamp.toDate ? timestamp.toDate() : timestamp;
  }

  async openQuestionDetail(question: Question) {
    const modal = await this.modalController.create({
      component: QuestionDetailModal,
      componentProps: {
        question: question
      },
      cssClass: 'question-detail-modal'
    });

    await modal.present();
  }

  isCurrentUserAuthor(userId: string): boolean {
    return !!this.auth.currentUser && this.auth.currentUser.uid === userId;
  }

  async confirmDeleteQuestion(question: Question, event: Event) {
    event.stopPropagation(); // Prevent opening the question details

    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this question? This action cannot be undone and will delete all associated answers.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteQuestion(question);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteQuestion(question: Question) {
    try {
      await this.questionService.deleteQuestion(question.id!);

      // Remove from local arrays
      this.allQuestions = this.allQuestions.filter(q => q.id !== question.id);
      this.questions = this.questions.filter(q => q.id !== question.id);

      this.presentToast('Question deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting question:', error);
      this.presentAlert(
        'Error Deleting Question', 
        error.message || 'Failed to delete question. Please try again.'
      );
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
