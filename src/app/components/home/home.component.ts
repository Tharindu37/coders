import { Component } from '@angular/core';

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
}
