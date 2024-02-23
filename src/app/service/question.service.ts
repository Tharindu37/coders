import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../model/question';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  generateAnswer(question: string) {
    return this.http.get(`http://127.0.0.1:8000/answer/${question}`);
  }

  addQuestion(question: Question) {
    return this.firestore.collection('question').add(question);
  }

  getQuestionByUserId(userId: string) {}

  getQuestions() {
    return this.firestore.collection('question').valueChanges();
  }
}
