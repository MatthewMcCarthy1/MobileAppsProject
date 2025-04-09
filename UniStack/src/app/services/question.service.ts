import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  
  async addQuestion(title: string, body: string): Promise<string> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to post a question');
      }
      
      const questionData = {
        title,
        body,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp()
      };
      
      console.log('Attempting to add question:', questionData);
      
      const docRef = await addDoc(collection(this.firestore, 'questions'), questionData);
      console.log('Question added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }
}
