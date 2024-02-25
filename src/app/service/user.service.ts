import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { User } from '../model/user';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage
  ) {}

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

  uploadPicture(file: File): Observable<string | any> {
    const fileName = this.firestore.createId();
    const filePath = `profilePicture/${fileName}`;
    const fileRef = this.firestorage.ref(filePath);
    const uploadTask = this.firestorage.upload(filePath, file);

    return from(uploadTask).pipe(switchMap(() => fileRef.getDownloadURL()));
  }
}
