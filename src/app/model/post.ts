import { Question } from './question';
import { User } from './user';

export interface Post {
  question: Question;
  user: User;
}
