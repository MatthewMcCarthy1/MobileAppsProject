import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { Question } from '../../models/question.model';
import { addIcons } from 'ionicons';
import { closeOutline, personCircleOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.modal.html',
  styleUrls: ['./question-detail.modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DatePipe]
})
export class QuestionDetailModal {
  @Input() question!: Question;

  constructor(private modalController: ModalController) {
    addIcons({
      closeOutline,
      personCircleOutline,
      timeOutline
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  formatDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : timestamp;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
