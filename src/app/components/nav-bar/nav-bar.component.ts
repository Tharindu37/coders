import { Component } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  isShow: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}
  showMenu() {
    this.isShow = !this.isShow;
    console.log(this.isShow);
  }

  async signOut() {
    try {
      await this.authService.logout();
      this.router.navigate(['/user']);
    } catch (error) {}
  }
}
