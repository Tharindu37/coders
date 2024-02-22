import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  generateAnswer(question: string) {
    return this.http.get(`http://127.0.0.1:8000/answer/${question}`);
  }
}
