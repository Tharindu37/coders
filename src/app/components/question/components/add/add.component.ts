import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { Question } from 'src/app/model/question';
import { QuestionService } from 'src/app/service/question.service';
import firebase from 'firebase/compat/app';
import { AuthService } from 'src/app/service/auth.service';
import { Answer } from 'src/app/model/answer';
import Swal from 'sweetalert2';
import { take } from 'rxjs';

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
  isGenerateAnswer: boolean = false;
  isGenerateWrongAnswer: boolean = false;
  isPostQuestion: boolean = false;
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
    this.isGenerateAnswer = true;
    const question = this.questionForm.get('question')?.value as string;
    this.questionService.generateAnswer(question).subscribe(
      (res: any) => {
        const jsonObject = JSON.parse(res.answer.content);
        this.model = {
          ...this.model,
          value: jsonObject.code,
          language: jsonObject.language,
        };
        this.isGenerateAnswer = false;
      },
      (error) => {
        this.isGenerateAnswer = false;
      }
    );
  }

  generateWrongAnswer() {
    this.isGenerateWrongAnswer = true;
    if (!this.code1) {
      this.isGenerateWrongAnswer = false;
      return;
    }
    this.questionService.generateWrongAnswer(this.code1 as string).subscribe(
      (res: any) => {
        console.log(res.wrong_answers[0]);

        this.model1 = {
          ...this.model1,
          language: this.model.language,
          value: res.wrong_answers[0],
        };
        this.model2 = {
          ...this.model2,
          language: this.model.language,
          value: res.wrong_answers[1],
        };
        this.model3 = {
          ...this.model3,
          language: this.model.language,
          value: res.wrong_answers[2],
        };
        this.isGenerateWrongAnswer = false;
      },
      (error) => {
        this.isGenerateWrongAnswer = false;
      }
    );
  }

  theme = 'vs-light';

  model: CodeModel = {
    language: 'java',
    uri: 'main.json',
    value: '',
  };

  model1: CodeModel = {
    language: 'java',
    uri: 'main1.json',
    value: '',
  };

  model2: CodeModel = {
    language: 'java',
    uri: 'main2.json',
    value: '',
  };

  model3: CodeModel = {
    language: 'java',
    uri: 'main3.json',
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

  async shuffleArray(array: Answer[]): Promise<Answer[]> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async addQuestion() {
    this.isPostQuestion = true;
    if (
      !this.question ||
      !this.code1 ||
      !this.code2 ||
      !this.code2 ||
      !this.code3 ||
      !this.code4
    ) {
      this.isPostQuestion = false;
      Swal.fire({
        title: 'Question Is Not Complete Error!',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (
      this.code1 == this.code2 ||
      this.code1 == this.code3 ||
      this.code1 == this.code4 ||
      this.code2 == this.code3 ||
      this.code2 == this.code4 ||
      this.code3 == this.code4
    ) {
      this.isPostQuestion = false;
      Swal.fire({
        title: 'Same Question Include Error!',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
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
      // Shuffle the answer array
      const shuffledAnswer = await this.shuffleArray(answer);
      this.authService
        .getCurrentUser()
        .pipe(take(1))
        .subscribe((user) => {
          const question: Question = {
            createdAt: firebase.firestore.Timestamp.now(),
            updatedAt: firebase.firestore.Timestamp.now(),
            userId: user.uid,
            id: '',
            tags: [],
            question: this.question,
            answer: shuffledAnswer,
            giveAnswer: [],
          };
          this.questionService
            .addQuestion(question)
            .then((res) => {
              this.isPostQuestion = false;
              Swal.fire({
                title: 'Question Added Successful!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
              });
            })
            .catch((error: any) => {
              this.isPostQuestion = false;
              Swal.fire({
                title: 'Question Added Error!',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
              });
            });
        });
    } catch (error) {
      this.isPostQuestion = false;
      console.log(error);
    }
  }
}
