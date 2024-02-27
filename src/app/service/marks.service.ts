import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Marks } from '../model/marks';

@Injectable({
  providedIn: 'root',
})
export class MarksService {
  constructor(private firestore: AngularFirestore) {}

  updateMarks(marks: Marks, marksId?: string) {
    if (marksId == undefined || marksId == '')
      return this.firestore.collection('marks').add(marks);
    else return this.firestore.collection('marks').doc(marksId).update(marks);
  }

  getMarksByUserId(userId: string) {
    return this.firestore
      .collection('marks', (ref) => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' });
  }
}
