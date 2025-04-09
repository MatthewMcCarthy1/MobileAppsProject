import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../app/services/question.service';
import { Question } from '../../app/models/question.model';
import { DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { personCircleOutline, timeOutline, add } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

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
    private questionService: QuestionService
  ) {
    addIcons({
      personCircleOutline,
      timeOutline,
      add
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
}
