import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';
import { UserService } from 'src/app/service/user.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  profilePicture: File | undefined;
  bannerPicture: File | undefined;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  onProfileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (files && files.length > 0) {
      const file = files[0] as File;
      // this.images.push(file)
      this.profilePicture = file;
    }
  }
  onBannerSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (files && files.length > 0) {
      const file = files[0] as File;
      // this.images.push(file)
      this.bannerPicture = file;
    }
  }

  registerForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    profilePic: new FormControl(Validators.required),
    bannerPic: new FormControl('', Validators.required),
  });

  async register() {
    console.log(this.register);
    const email = this.registerForm.get('email')?.value as string;
    const password = this.registerForm.get('password')?.value as string;
    console.log(email, password);
    try {
      const res = await this.authService.register(email, password);
      const profileUrlPromise = this.userService.uploadPicture(
        this.profilePicture!
      );
      const bannerUrlPromise = this.userService.uploadPicture(
        this.bannerPicture!
      );
      // const [profileUrl, bannerUrl] = await Promise.all([
      //   profileUrlPromise,
      //   bannerUrlPromise,
      // ]);
      const [profileUrl, bannerUrl] = await Promise.all([
        lastValueFrom(profileUrlPromise),
        lastValueFrom(bannerUrlPromise),
      ]);
      const displayName = this.registerForm.get('username')?.value as string;
      const description = this.registerForm.get('description')?.value as string;
      const user: User = {
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
        userId: res.user?.uid || '',
        accounts: [],
        bannerURL: bannerUrl,
        displayName: res.user?.displayName || displayName,
        email: res.user?.email || '',
        emailVerified: res.user?.emailVerified || false,
        photoURL: res.user?.photoURL || profileUrl,
        id: '',
        description: description,
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
