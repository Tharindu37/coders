import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Marks } from '../model/marks';

@Injectable({
  providedIn: 'root',
})
export class MarksService {
  constructor(private firestore: AngularFirestore) {}

  updateMarks(marks: Marks, marksId?: string) {
    console.log(marks);
    console.log('marksid', marksId);
    if (!marksId) return this.firestore.collection('marks').add(marks);
    else return this.firestore.collection('marks').doc(marksId).update(marks);
  }

  getMarksByUserId(userId: string) {
    console.log('userid', userId);
    return this.firestore
      .collection('marks', (ref) => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' });
  }
}
