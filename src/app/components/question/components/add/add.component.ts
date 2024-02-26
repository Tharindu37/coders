import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { Question } from 'src/app/model/question';
import { QuestionService } from 'src/app/service/question.service';
import firebase from 'firebase/compat/app';
import { AuthService } from 'src/app/service/auth.service';
import { Answer } from 'src/app/model/answer';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  question: string = '';
  code1: string | undefined;
  code2: string | undefined;
  code3: string | undefined;
  code4: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private authService: AuthService
  ) {}

  questionForm = new FormGroup({
    question: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.question = this.route.snapshot.queryParams['question'];
    this.questionForm.get('question')?.setValue(this.question);
  }

  generateAnswer() {
    const question = this.questionForm.get('question')?.value as string;
    this.questionService.generateAnswer(question).subscribe((res: any) => {
      console.log(res);
      console.log(res.answer.content);
      const jsonObject = JSON.parse(res.answer.content);
      console.log(jsonObject);
      this.model = {
        ...this.model,
        value: jsonObject.code,
        language: jsonObject.language,
      };
    });
  }

  theme = 'vs-light';

  model: CodeModel = {
    language: 'java',
    uri: 'main.json',
    value: '',
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  onCodeChanged(value: string) {
    this.code1 = value;
  }

  onCode2Changed(value: string) {
    this.code2 = value;
  }

  onCode3Changed(value: string) {
    this.code3 = value;
  }

  onCode4Changed(value: string) {
    this.code4 = value;
  }

  async addQuestion() {
    if (
      !this.question ||
      !this.code1 ||
      !this.code2 ||
      !this.code2 ||
      !this.code3 ||
      !this.code4
    ) {
      return;
    }

    try {
      const answer: Answer[] = [
        {
          index: 1,
          code: this.code1!,
          status: true,
        },
        {
          index: 2,
          code: this.code2!,
          status: false,
        },
        {
          index: 3,
          code: this.code3!,
          status: false,
        },
        {
          index: 4,
          code: this.code4!,
          status: false,
        },
      ];
      this.authService.getCurrentUser().subscribe((user) => {
        const question: Question = {
          createdAt: firebase.firestore.Timestamp.now(),
          updatedAt: firebase.firestore.Timestamp.now(),
          userId: user.uid,
          id: '',
          tags: [],
          question: this.question,
          answer: answer,
          giveAnswer: [],
        };
        this.questionService
          .addQuestion(question)
          .then((res) => {
            console.log('add question');
          })
          .catch((error: any) => {
            console.log(error);
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
