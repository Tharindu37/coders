import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Marks } from 'src/app/model/marks';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { MarksService } from 'src/app/service/marks.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user: User | undefined;
  marks: Marks | undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private marksService: MarksService
  ) {
    const uid = this.route.snapshot.paramMap.get('id');
    this.authService.getCurrentUser().subscribe((fireUser: any) => {
      userService.getUserById(uid!).subscribe((res) => {
        this.user = res[0] as User;
      });
    });
    this.authService
      .getCurrentUser()

      .subscribe((fireUser: any) => {
        this.marksService.getMarksByUserId(uid!).subscribe((m) => {
          this.marks = m[0] as Marks;
        });
      });
  }
}
