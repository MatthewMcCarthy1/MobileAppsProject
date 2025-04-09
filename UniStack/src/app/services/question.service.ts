import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Question } from '../models/question.model';
import { Observable } from 'rxjs';

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

  getQuestions(): Observable<Question[]> {
    const questionsRef = collection(this.firestore, 'questions');
    const questionsQuery = query(questionsRef, orderBy('createdAt', 'desc'));
    return collectionData(questionsQuery, { idField: 'id' }) as Observable<Question[]>;
  }
}
