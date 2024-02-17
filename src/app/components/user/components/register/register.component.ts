import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private authService: AuthService) {}

  registerForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  async register() {
    console.log(this.register);
    const email = this.registerForm.get('email')?.value as string;
    const password = this.registerForm.get('password')?.value as string;
    console.log(email, password);
    try {
      const res = await this.authService.register(email, password);
      Swal.fire({
        title: 'Registation Successful!',
        icon: 'success',
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Registation Error!',
        text: error.meesge,
        icon: 'error',
      });
    }
  }
}
