import firebase from 'firebase/compat/app';
import { Answer } from './answer';
import { GiveAnswer } from './give-answer';
export interface Question {
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  userId: string;
  id: string;
  tags: string[];
  question: string;
  answer: Answer[];
  giveAnswer: GiveAnswer[];
}
