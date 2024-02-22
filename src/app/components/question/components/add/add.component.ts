import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { QuestionService } from 'src/app/service/question.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  question: string = '';
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  questionForm = new FormGroup({
    question: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.question = this.route.snapshot.queryParams['question'];
    console.log(this.question);
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
    console.log('CODE', value);
  }
}
