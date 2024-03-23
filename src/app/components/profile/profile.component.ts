import { Component } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user: User | undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    const uid = this.route.snapshot.paramMap.get('id');
    this.authService.getCurrentUser().subscribe((fireUser: any) => {
      userService.getUserById(uid!).subscribe((res) => {
        this.user = res[0] as User;
      });
    });
  }
}
