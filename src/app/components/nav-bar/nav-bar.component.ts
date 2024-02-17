import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  isShow: boolean = true;

  showMenu() {
    this.isShow = !this.isShow;
    console.log(this.isShow);
  }
}
