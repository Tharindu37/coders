import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../model/question';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { GiveAnswer } from '../model/give-answer';
import { transition } from '@angular/animations';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  generateAnswer(question: string) {
    return this.http.get(`${environment.apiUrl}answer/${question}`);
  }

  // generateWrongAnswer(answer: string) {
  //   return this.http.get(
  //     `${environment.apiUrl}wrong_answer/${encodeURIComponent(answer)}`
  //   );
  // }

  generateWrongAnswer(answer: string): Observable<any> {
    const requestBody = { answer };
    return this.http.post<any>(
      `${environment.apiUrl}wrong_answer`,
      requestBody
    );
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

  // getQuestionsForScrollByUser(
  //   batch: number,
  //   userId: string,
  //   lastkey?: firebase.firestore.Timestamp
  // ): Observable<Question[]> {
  //   return this.firestore
  //     .collection('question', (ref) => {
  //       let query = ref.orderBy('createdAt', 'desc'); // Order by createdAt in descending order

  //       if (lastkey) {
  //         query = query.startAfter(lastkey); // Use startAfter if lastkey is provided
  //       }

  //       return query.limit(batch); // Limit the number of results
  //     })
  //     .valueChanges({ idField: 'id' })
  //     .pipe(
  //       // Exclude questions where userId matches any userId in giveAnswer array
  //       map((questions: any[]) => {
  //         return questions.filter(
  //           (question) => !this.hasMatchingUserId(question.giveAnswer, userId)
  //         );
  //       })
  //     );
  // }

  // private hasMatchingUserId(giveAnswer: any[], userId: string): boolean {
  //   return giveAnswer?.some((answer) => answer.userId === userId);
  // }

  // getQuestionsForScrollByUser(
  //   batch: number,
  //   userId: string,
  //   lastkey?: firebase.firestore.Timestamp
  // ): Observable<Question[]> {
  //   return this.firestore
  //     .collection('question', (ref) => {
  //       let query = ref.orderBy('createdAt', 'desc'); // Order by createdAt in descending order

  //       if (lastkey) {
  //         query = query.startAfter(lastkey); // Use startAfter if lastkey is provided
  //       }

  //       return query.limit(batch); // Limit the number of results
  //     })
  //     .valueChanges({ idField: 'id' })
  //     .pipe(
  //       // Exclude questions where userId matches any userId in giveAnswer array
  //       map((questions: any[]) => {
  //         return questions.filter((question) =>
  //           this.isQuestionValid(question, userId)
  //         );
  //       })
  //     );
  // }

  // private isQuestionValid(question: any, userId: string): boolean {
  //   console.log(question);
  //   if (!question.giveAnswer || question.giveAnswer.length === 0) {
  //     return true; // If no giveAnswer, include the question
  //   }
  //   return !question.giveAnswer.some((answer: any) => answer.userId === userId);
  // }

  getQuestionsForScrollByUser(
    batch: number,
    userId: string,
    lastkey?: firebase.firestore.Timestamp
  ): Observable<Question[]> {
    return this.firestore
      .collection('question', (ref) => {
        let query = ref.orderBy('createdAt', 'desc'); // Order by createdAt in descending order

        if (lastkey) {
          query = query.startAfter(lastkey); // Use startAfter if lastkey is provided
        }

        return query; // Do not limit yet
      })
      .valueChanges({ idField: 'id' })
      .pipe(
        // Exclude questions where userId matches any userId in giveAnswer array
        map((questions: any[]) => {
          const filteredQuestions = questions.filter((question) =>
            this.isQuestionValid(question, userId)
          );
          return filteredQuestions.slice(0, batch); // Limit the number of results after filtering
        })
      );
  }

  private isQuestionValid(question: any, userId: string): boolean {
    if (!question.giveAnswer || question.giveAnswer.length === 0) {
      return true; // If no giveAnswer, include the question
    }
    return !question.giveAnswer.some((answer: any) => answer.userId === userId);
  }

  giveAnswer(giveAnswer: GiveAnswer, questionId: string) {
    const questionRef: any = this.firestore
      .collection('question')
      .doc(questionId);

    return this.firestore.firestore.runTransaction((transaction) => {
      return transaction.get(questionRef.ref).then((doc) => {
        if (!doc.exists) {
          throw new Error('Question document does not exist');
        }

        // Get the current data of the question document
        const questionData: any = doc.data();
        // Append the new giveAnswer entry to the existing giveAnswer array
        const updatedGiveAnswer = [
          ...(questionData?.giveAnswer || []),
          giveAnswer,
        ];

        // Update the question document with the new giveAnswer data
        transaction.update(questionRef.ref, {
          giveAnswer: updatedGiveAnswer,
        });
      });
    });
  }
}
