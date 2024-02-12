import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuestionComponent } from './components/question/question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddComponent } from './components/question/components/add/add.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'question',
    component: QuestionComponent,
    children: [
      { path: '', redirectTo: 'add', pathMatch: 'full' },
      { path: 'add', component: AddComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
