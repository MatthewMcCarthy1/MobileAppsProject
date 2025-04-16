// Import required dependencies from Angular and Firebase
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, collectionData, query, orderBy, doc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
// Import model interfaces for type safety
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { Observable } from 'rxjs';

/**
 * Service for managing questions and answers in the UniStack application
 * Handles CRUD operations with Firestore database
 */
@Injectable({
  providedIn: 'root' // This service is available throughout the app
})
export class QuestionService {
  // Inject Firestore and Auth services for database operations and user authentication
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  
  /**
   * Creates a new question in the database
   * @param title - The title of the question
   * @param body - The detailed content of the question
   * @returns A Promise containing the new question's ID
   */
  async addQuestion(title: string, body: string): Promise<string> {
    try {
      // Get current user from authentication
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to post a question');
      }
      
      // Prepare question data with user information and timestamp
      const questionData = {
        title,
        body,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp()
      };
      
      // Add question to Firestore and return the document ID
      const docRef = await addDoc(collection(this.firestore, 'questions'), questionData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }

  /**
   * Retrieves a list of questions from the database
   * @returns An Observable of an array of Question objects
   */
  getQuestions(): Observable<Question[]> {
    // Reference the 'questions' collection and order by creation date
    const questionsRef = collection(this.firestore, 'questions');
    const questionsQuery = query(questionsRef, orderBy('createdAt', 'desc'));
    return collectionData(questionsQuery, { idField: 'id' }) as Observable<Question[]>;
  }
  
  /**
   * Adds an answer to a specific question
   * @param questionId - The ID of the question to answer
   * @param answerText - The content of the answer
   * @returns A Promise containing the new answer's ID
   */
  async addAnswer(questionId: string, answerText: string): Promise<string> {
    try {
      // Get current user from authentication
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to post an answer');
      }
      
      // Prepare answer data with user information and timestamp
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

  /**
   * Retrieves a list of answers for a specific question
   * @param questionId - The ID of the question
   * @returns An Observable of an array of Answer objects
   */
  getAnswers(questionId: string): Observable<Answer[]> {
    // Reference the 'answers' subcollection and order by creation date
    const answersRef = collection(this.firestore, `questions/${questionId}/answers`);
    const answersQuery = query(answersRef, orderBy('createdAt', 'asc'));
    return collectionData(answersQuery, { idField: 'id' }) as Observable<Answer[]>;
  }

  /**
   * Deletes a specific question from the database
   * @param questionId - The ID of the question to delete
   * @returns A Promise that resolves when the question is deleted
   */
  async deleteQuestion(questionId: string): Promise<void> {
    try {
      // Get current user from authentication
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to delete a question');
      }
      
      // Delete the question document from Firestore
      await deleteDoc(doc(this.firestore, 'questions', questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  /**
   * Deletes a specific answer from a question
   * @param questionId - The ID of the question
   * @param answerId - The ID of the answer to delete
   * @returns A Promise that resolves when the answer is deleted
   */
  async deleteAnswer(questionId: string, answerId: string): Promise<void> {
    try {
      // Get current user from authentication
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to delete an answer');
      }
      
      // Delete the answer document from the 'answers' subcollection
      await deleteDoc(doc(this.firestore, `questions/${questionId}/answers`, answerId));
    } catch (error) {
      console.error('Error deleting answer:', error);
      throw error;
    }
  }
}
