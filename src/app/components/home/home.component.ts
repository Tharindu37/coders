import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { EditProfileComponent } from '../user/components/edit-profile/edit-profile.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user: User | undefined;
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private dialogRef: MatDialog
  ) {
    this.authService.getCurrentUser().subscribe((fireUser: any) => {
      userService.getUserById(fireUser.uid).subscribe((res) => {
        this.user = res[0] as User;
      });
    });
  }

  editProfile() {
    this.dialogRef.open(EditProfileComponent);
  }

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
