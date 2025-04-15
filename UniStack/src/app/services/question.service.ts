import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, collectionData, query, orderBy, doc, deleteDoc } from '@angular/fire/firestore';
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
      
      const docRef = await addDoc(collection(this.firestore, 'questions'), questionData);
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
  
  async addAnswer(questionId: string, answerText: string): Promise<string> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to post an answer');
      }
      
      const answerData = {
        text: answerText,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp()
      };
      
      // Create answer in subcollection of the question
      const answersRef = collection(this.firestore, `questions/${questionId}/answers`);
      const docRef = await addDoc(answersRef, answerData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  }

  getAnswers(questionId: string): Observable<any[]> {
    const answersRef = collection(this.firestore, `questions/${questionId}/answers`);
    const answersQuery = query(answersRef, orderBy('createdAt', 'asc'));
    return collectionData(answersQuery, { idField: 'id' });
  }

  async deleteQuestion(questionId: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to delete a question');
      }
      
      await deleteDoc(doc(this.firestore, 'questions', questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  async deleteAnswer(questionId: string, answerId: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to delete an answer');
      }
      
      await deleteDoc(doc(this.firestore, `questions/${questionId}/answers`, answerId));
    } catch (error) {
      console.error('Error deleting answer:', error);
      throw error;
    }
  }
}
