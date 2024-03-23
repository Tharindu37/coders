import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom, take } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import firebase from 'firebase/compat/app';
import Swal from 'sweetalert2';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Social } from 'src/app/model/social';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user: User | undefined;
  profilePicture: File | undefined;
  profilePictureEvent: Event | undefined;
  bannerPicture: File | undefined;
  bannerPrictureEvent: Event | undefined;
  isUpdating: boolean = false;
  isSelectProfile: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((fireUser: any) => {
      this.userService.getUserById(fireUser.uid).subscribe((res) => {
        this.user = res[0] as User;
        this.editProfileForm.get('username')?.setValue(this.user.displayName);
        this.editProfileForm
          .get('description')
          ?.setValue(this.user.description);
        this.editProfileForm
          .get('facebook')
          ?.setValue(this.user.accounts[0]?.url);
        this.editProfileForm
          .get('github')
          ?.setValue(this.user.accounts[1]?.url);
        this.editProfileForm
          .get('linkedin')
          ?.setValue(this.user.accounts[2]?.url);
        this.editProfileForm.get('web')?.setValue(this.user.accounts[3]?.url);
      });
    });
  }

  editProfileForm = new FormGroup({
    username: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    profilePic: new FormControl(''),
    bannerPic: new FormControl(''),
    facebook: new FormControl(''),
    github: new FormControl(''),
    linkedin: new FormControl(''),
    web: new FormControl(''),
  });

  onProfileSelected(event: Event) {
    this.isSelectProfile = true;
    this.profilePictureEvent = event;
    // const inputElement = event.target as HTMLInputElement;
    // const files = inputElement.files;

    // if (files && files.length > 0) {
    //   const file = files[0] as File;
    //   // this.images.push(file)
    //   this.profilePicture = file;
    // }
  }
  onBannerSelected(event: Event) {
    this.isSelectProfile = false;
    this.bannerPrictureEvent = event;
    // const inputElement = event.target as HTMLInputElement;
    // const files = inputElement.files;

    // if (files && files.length > 0) {
    //   const file = files[0] as File;
    //   // this.images.push(file)
    //   this.bannerPicture = file;
    // }
  }

  cropImg(event: ImageCroppedEvent) {
    const blob = event.blob;
    this.profilePicture = new File([blob!], 'crop_profile', {
      type: 'image/png',
    });
    this.editProfileForm.get('profilePic')?.setValue(null);
  }

  cropBanner(event: ImageCroppedEvent) {
    const blob = event.blob;
    this.bannerPicture = new File([blob!], 'crop_profile', {
      type: 'image/png',
    });
    this.editProfileForm.get('bannerPic')?.setValue(null);
  }

  async updateProfile() {
    this.isUpdating = true;

    // const [profileUrl, bannerUrl] = await Promise.all([
    //   profileUrlPromise,
    //   bannerUrlPromise,
    // ]);
    // const [profileUrl, bannerUrl] = await Promise.all([
    //   lastValueFrom(profileUrlPromise),
    //   lastValueFrom(bannerUrlPromise),
    // ]);
    let profileUrl = '';
    let bannerUrl = '';
    // if (this.profilePicture) {
    //   const profileUrlPromise = this.userService.uploadPicture(
    //     this.profilePicture!
    //   );
    //   profileUrl == (await Promise.resolve(lastValueFrom(profileUrlPromise)));
    // }

    if (this.profilePicture) {
      const profileUrlPromise = this.userService.uploadPicture(
        this.profilePicture!
      );
      profileUrl = await lastValueFrom(profileUrlPromise);
    }

    const facebook: Social = {
      name: 'facebook',
      url: (this.editProfileForm.get('facebook')?.value as string) || '',
    };

    const github: Social = {
      name: 'github',
      url: (this.editProfileForm.get('github')?.value as string) || '',
    };

    const linkedin: Social = {
      name: 'linkedin',
      url: (this.editProfileForm.get('linkedin')?.value as string) || '',
    };

    const web: Social = {
      name: 'web',
      url: (this.editProfileForm.get('web')?.value as string) || '',
    };

    const accounts: Social[] = [facebook, github, linkedin, web];

    // if (this.bannerPicture) {
    //   const bannerUrlPromise = this.userService.uploadPicture(
    //     this.bannerPicture!
    //   );
    //   bannerUrl = await Promise.resolve(lastValueFrom(bannerUrlPromise));
    // }

    if (this.bannerPicture) {
      const bannerUrlPromise = this.userService.uploadPicture(
        this.bannerPicture!
      );
      bannerUrl = await lastValueFrom(bannerUrlPromise);
    }
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((fireUser: any) => {
        this.userService
          .getUserById(fireUser.uid)
          .pipe(take(1))
          .subscribe(
            (res) => {
              this.user = res[0] as User;
              const newUser: User = {
                createdAt: this.user.createdAt,
                updatedAt: firebase.firestore.Timestamp.now(),
                userId: this.user.userId,
                displayName: this.editProfileForm.get('username')
                  ?.value as string,
                photoURL: profileUrl ? profileUrl : this.user.photoURL,
                bannerURL: bannerUrl ? bannerUrl : this.user.bannerURL,
                accounts: accounts!,
                email: this.user.email,
                emailVerified: this.user.emailVerified,
                description: this.editProfileForm.get('description')
                  ?.value as string,
                id: this.user.id,
              };
              this.userService
                .updateById(this.user.id, newUser)
                .then((res) => {
                  this.profilePictureEvent = undefined;
                  this.bannerPrictureEvent = undefined;
                  this.isUpdating = false;
                  Swal.fire({
                    title: 'Update Successful!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000,
                  });
                })
                .catch((error: any) => {
                  this.profilePictureEvent = undefined;
                  this.bannerPrictureEvent = undefined;
                  this.isUpdating = false;
                  console.log(error);
                  Swal.fire({
                    title: 'Update Error!',
                    text: error.meesge,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1000,
                  });
                });
            },
            (error) => {
              this.isUpdating = false;
            }
          );
      });
  }
}
