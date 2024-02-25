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

  // getQuestions() {
  //   this.questionService.getQuestions().subscribe((question) => {
  //     console.log(question);
  //     this.questions = question as Question[];
  //   });
  // }

  batch = 2;
  lastKey: Question | undefined;
  finished = false;

  // getQuestions() {
  //   if (this.finished) return;
  //   this.questionService
  //     .getQuestionsForScroll(this.batch, this.lastKey?.createdAt)
  //     .pipe(
  //       // Retry the HTTP request with a delay when there's an error
  //       retryWhen((errors) =>
  //         errors.pipe(
  //           // Delay before retrying
  //           delay(3000), // Adjust the delay time as needed
  //           // Retry a maximum of 3 times (adjust as needed)
  //           take(3),
  //           // Log the error
  //           tap((error) => console.error('Error fetching questions:', error))
  //         )
  //       )
  //     )
  //     .subscribe((question) => {
  //       this.questions = this.questions.concat(question as Question[]);
  //       this.lastKey = question.slice(-1)[0] as Question;
  //       console.log(this.lastKey);
  //     });
  // }

  getQuestions() {
    if (this.finished) return;
    this.questionService
      .getQuestionsForScroll(this.batch, this.lastKey?.createdAt)
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
              };
              console.log(post);
              this.posts.push(post);
            });
        });
      });
  }

  selector: string = '.main-panel';
  onScroll() {
    this.getQuestions();
  }

  async giveAnswer(questionId: string, isTrue: boolean) {
    console.log(questionId, isTrue);
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
}
