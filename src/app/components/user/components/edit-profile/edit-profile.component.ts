import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  constructor() {}

  registerForm = new FormGroup({});

  onProfileSelected(event: Event) {}

  onBannerSelected(event: Event) {}
}
