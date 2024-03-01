import { Component, OnInit } from '@angular/core';
import { Marks } from 'src/app/model/marks';
import { AuthService } from 'src/app/service/auth.service';
import { MarksService } from 'src/app/service/marks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private marksService: MarksService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getMarks();
  }
  marks: Marks | undefined;

  getMarks() {
    this.authService
      .getCurrentUser()

      .subscribe((fireUser: any) => {
        this.marksService.getMarksByUserId(fireUser.uid).subscribe((m) => {
          this.marks = m[0] as Marks;
        });
      });
  }
}
