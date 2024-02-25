import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../model/question';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
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

  getQuestionsForScroll(batch: number, lastkey?: firebase.firestore.Timestamp) {
    return this.firestore
      .collection('question', (ref) => {
        if (lastkey)
          return ref.orderBy('createdAt').startAfter(lastkey).limit(batch);
        else return ref.orderBy('createdAt').limit(batch);
      })
      .valueChanges({ idField: 'id' });
  }
}
