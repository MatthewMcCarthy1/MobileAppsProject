import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';

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

  constructor() {
  }

  async submitQuestion() {
    // TODO: Implement submission to backend
    console.log('Question submitted:', this.question);
    // Clear form after submission
    this.question = {
      title: '',
      body: ''
    };
  }
}
