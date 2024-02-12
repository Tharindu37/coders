import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<any>;

  constructor(private fireAuth: AngularFireAuth) {
    this.user = fireAuth.authState;
  }

  // get current user
  getCurrentUser() {
    return this.user;
  }

  // login
  login(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  // register
  register(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  // sign out
  logout() {
    return this.fireAuth.signOut();
  }

  // forgot password
  forgotPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  // email varification
  sendEmailForVarification(user: any) {
    return user.snedEmailVerification();
  }
}
