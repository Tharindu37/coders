import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { EditProfileComponent } from '../user/components/edit-profile/edit-profile.component';
import { Question } from 'src/app/model/question';
import { QuestionService } from 'src/app/service/question.service';
import { delay, map, pipe, retryWhen, take, tap } from 'rxjs';
import { Answer } from 'src/app/model/answer';
import { Post } from 'src/app/model/post';
import { MarksService } from 'src/app/service/marks.service';
import { Marks } from 'src/app/model/marks';
import { GiveAnswer } from './../../model/give-answer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: User | undefined;
  questions: Question[] = [];
  posts: Post[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private dialogRef: MatDialog,
    private questionService: QuestionService,
    private marksService: MarksService
  ) {
    this.authService.getCurrentUser().subscribe((fireUser: any) => {
      userService.getUserById(fireUser.uid).subscribe((res) => {
        this.user = res[0] as User;
      });
    });
  }
  ngOnInit(): void {
    this.getQuestions();
  }

  editProfile() {
    this.dialogRef.open(EditProfileComponent);
  }

  textAreaForm = new FormGroup({
    question: new FormControl('', Validators.required),
  });

  addQuestion() {
    const question = this.textAreaForm.get('question')?.value as string;
    this.router.navigate(['/question/add'], {
      queryParams: { question: question },
    });
  }

  batch = 2;
  lastKey: Question | undefined;
  finished = false;

  // getQuestions() {
  //   if (this.finished) return;
  //   this.questionService
  //     .getQuestionsForScroll(this.batch, this.lastKey?.createdAt)
  //     .pipe(take(1))
  //     .subscribe((questions: any[]) => {
  //       // this.questions = this.questions.concat(question as Question[]);
  //       this.lastKey = questions.slice(-1)[0] as Question;
  //       questions.forEach((question) => {
  //         this.userService
  //           .getUserById(question.userId)
  //           .pipe(take(1))
  //           .subscribe((user: any) => {
  //             const post: Post = {
  //               question: question,
  //               user: user[0] as User,
  //             };
  //             console.log(post);
  //             this.posts.push(post);
  //           });
  //       });
  //     });
  // }

  getQuestions() {
    if (this.finished) return;
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.questionService
          .getQuestionsForScrollByUser(
            this.batch,
            user.uid,
            this.lastKey?.createdAt
          )
          .pipe(take(1))
          .subscribe((questions: any[]) => {
            // this.questions = this.questions.concat(question as Question[]);
            this.lastKey = questions.slice(-1)[0] as Question;
            questions.forEach((question) => {
              this.userService
                .getUserById(question.userId)
                .pipe(take(1))
                .subscribe((user: any) => {
                  const post: Post = {
                    question: question,
                    user: user[0] as User,
                    answer: 0,
                  };
                  console.log(post);
                  this.posts.push(post);
                });
            });
          });
      });
  }

  selector: string = '.main-panel';
  onScroll() {
    this.getQuestions();
  }

  updateMarks(questionId: string, isTrue: boolean) {
    if (isTrue)
      this.authService
        .getCurrentUser()
        .pipe(take(1))
        .subscribe((user) => {
          this.marksService
            .getMarksByUserId(user.uid)
            .pipe(take(1))
            .subscribe((m: any[]) => {
              const marks: Marks = {
                userId: user.uid,
                marks: m.length != 0 ? (m[0].marks as number) + 1 : 1,
                status: '',
                id: '',
              };
              this.marksService
                .updateMarks(marks, m.length != 0 ? m[0].id : '')
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
        });
    else
      this.authService.getCurrentUser().subscribe((user) => {
        this.marksService.getMarksByUserId(user.userId).subscribe((m: any) => {
          const marks: Marks = {
            userId: user.userId,
            marks: m.marks ? (m.marks as number) - 1 : -1,
            status: '',
            id: '',
          };
          this.marksService
            .updateMarks(marks, m.id)
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
  }

  giveAnswer(questionId: string, index: number, answer: number) {
    if (answer != 0) return;
    this.updatePost(questionId, index);
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        const giveAnswer: GiveAnswer = {
          id: '',
          userId: user.uid,
          answer: index,
        };

        this.questionService
          .giveAnswer(giveAnswer, questionId)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  private updatePost(questionId: string, index: number) {
    const post = this.posts.find((post) => post.question.id == questionId);
    if (post) {
      post.answer = index;
    }
    console.log(post);
  }
}
