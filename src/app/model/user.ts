import firebase from 'firebase/compat/app';
import { Social } from './social';

export interface User {
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  userId: string;
  displayName: string;
  photoURL: string;
  bannerURL: string;
  accounts: Social[];
  email: string;
  emailVerified: boolean;
  discription: string;
  id: string;
}
