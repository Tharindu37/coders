import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {
    authService
      .getCurrentUser()
      .pipe(
        map((user) => {
          if (user)
            router.navigate([localStorage.getItem('returnUrl') || '/home']);
        })
      )
      .subscribe();
  }

  loginFrom = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  async login() {
    const email = this.loginFrom.get('email')?.value as string;
    const password = this.loginFrom.get('password')?.value as string;
    try {
      const res = await this.authService.login(email, password);
      this.router.navigate(['/home']);
      Swal.fire({
        title: 'Login Successful!',
        icon: 'success',
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Login Error!',
        text: error.message,
        icon: 'error',
        showConfirmButton: false,
      });
    }
  }
}
