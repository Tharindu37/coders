import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { map } from 'rxjs';
import { ActivatedRoute, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'coders';
  constructor(private authService: AuthService, private router: Router) {}
}
