import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  question: string = '';
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.question = this.route.snapshot.queryParams['question'];
    console.log(this.question);
  }
}
