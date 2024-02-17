import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  saveUser(user: User) {
    return this.firestore.collection('user').add(user);
  }

  getUserById(userId: string) {
    return this.firestore
      .collection('user', (ref) => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' });
  }

  updateById(id: string, user: User) {
    return this.firestore.collection('user').doc(id).update(user);
  }
}
