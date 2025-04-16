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

/**
 * HomePage Component
 * 
 * Main page displaying a list of questions with search and filtering capabilities
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, DatePipe, RouterLink]
})
export class HomePage implements OnInit {
  // Text entered in the search field
  searchText: string = '';
  // Currently displayed questions
  questions: Question[] = [];
  // Complete list of all questions from database
  allQuestions: Question[] = [];
  // Flag to track loading state
  isLoading = true;

  constructor(
    private questionService: QuestionService, 
    private modalController: ModalController, 
    private alertController: AlertController, 
    private toastController: ToastController, 
    private auth: Auth 
  ) {
    // Add icons to be used in the component
    addIcons({
      personCircleOutline,
      timeOutline,
      add,
      trashOutline,
      ellipsisVertical
    });
  }

  ngOnInit() {
    // Load questions when the component initializes
    this.loadQuestions();
  }

  /**
   * Fetches questions from the service and updates the component state
   */
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

  /**
   * Handles changes in the search input field
   * @param event - The input event containing the search text
   */
  onSearchChange(event: any) {
    this.searchText = event.detail.value || '';
    this.filterQuestions(this.searchText);
  }

  /**
   * Filters the list of questions based on the search text
   * @param searchText - The text to filter questions by
   */
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

  /**
   * Formats a Firebase Timestamp to a JavaScript Date object
   * @param timestamp - The Firebase Timestamp to format
   * @returns A Date object or null if the timestamp is invalid
   */
  formatDate(timestamp: any) {
    if (!timestamp) return null;
    
    // Convert Firebase Timestamp to Date
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    
    return timestamp;
  }

  /**
   * Opens a modal displaying the details of a question
   * @param question - The question to display details for
   */
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

  /**
   * Checks if the current user is the author of a question
   * @param userId - The ID of the user to check
   * @returns True if the current user is the author, false otherwise
   */
  isCurrentUserAuthor(userId: string): boolean {
    return !!this.auth.currentUser && this.auth.currentUser.uid === userId;
  }

  /**
   * Displays a confirmation alert before deleting a question
   * @param question - The question to delete
   * @param event - The event triggering the deletion
   */
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

  /**
   * Deletes a question and updates the local state
   * @param question - The question to delete
   */
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

  /**
   * Displays a toast message
   * @param message - The message to display
   * @param color - The color of the toast ('success' or 'danger')
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
   * Displays an alert message
   * @param header - The header of the alert
   * @param message - The message to display
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
