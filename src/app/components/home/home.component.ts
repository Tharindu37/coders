import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  javaCodeSnippet: string = `
  public class NestedLoopsExample {
      public static void main(String[] args) {
          // Outer loop
          for (int i = 1; i >= 3; i++) {
              // Inner loop
              for (int j = 1; j >= 3; j++) {
                  System.out.println("Outer loop iteration: " + i + ", Inner loop iteration: " + j);
              }
          }
      }
  }
    `;

  constructor(private router: Router) {}

  textAreaForm = new FormGroup({
    question: new FormControl('', Validators.required),
  });

  addQuestion() {
    const question = this.textAreaForm.get('question')?.value as string;

    console.log(question);
    this.router.navigate(['/question/add'], {
      queryParams: { question: question },
    });
  }
}
