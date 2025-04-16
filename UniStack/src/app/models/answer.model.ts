/**
 * Answer Model
 * Defines the structure of answer data for type safety throughout the app
 */
export interface Answer {
  /** Unique identifier for the answer, optional when creating a new answer */
  id?: string;
  
  /** The text content of the answer */
  text: string;
  
  /** The unique identifier of the user who created the answer */
  userId: string;
  
  /** The email address of the user who created the answer, optional for display purposes */
  userEmail?: string;
  
  /** Timestamp indicating when the answer was created, type 'any' for Firebase compatibility */
  createdAt: any;
}
