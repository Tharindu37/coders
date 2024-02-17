import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

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
      const user: User = {
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
        userId: res.user?.uid || '',
        accounts: [],
        bannerURL: '',
        displayName: res.user?.displayName || '',
        email: res.user?.email || '',
        emailVerified: res.user?.emailVerified || false,
        photoURL: res.user?.photoURL || '',
      };
      const saveRes = await this.userService.saveUser(user);
      Swal.fire({
        title: 'Registation Successful!',
        icon: 'success',
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Registation Error!',
        text: error.meesge,
        icon: 'error',
        showConfirmButton: false,
      });
    }
  }
}
