/**
 * Question Model
 * Defines the structure of question data for type safety throughout the app
 */
export interface Question {
  /** Unique identifier for the question, optional when creating a new question */
  id?: string;
  
  /** The title/headline of the question */
  title: string;
  
  /** The detailed content of the question */
  body: string;
  
  /** The unique identifier of the user who created the question */
  userId: string;
  
  /** The email address of the user who created the question, optional for display purposes */
  userEmail?: string;
  
  /** Timestamp indicating when the question was created, type 'any' for Firebase compatibility */
  createdAt: any; 
}
