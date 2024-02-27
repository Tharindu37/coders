import { Component } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from './../../model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  isShow: boolean = true;
  user: User | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    // this.authService.getCurrentUser().pipe(
    //   map((user: User) => {
    //     console.log(user);
    //   })
    // );
    this.authService.getCurrentUser().subscribe((fireUser: any) => {
      userService.getUserById(fireUser.uid).subscribe((res) => {
        this.user = res[0] as User;
      });
    });
  }
  showMenu() {
    this.isShow = !this.isShow;
  }

  async signOut() {
    try {
      await this.authService.logout();
      this.router.navigate(['/user']);
    } catch (error) {}
  }
}
