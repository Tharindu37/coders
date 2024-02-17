import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuestionComponent } from './components/question/question.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.development';
import { AddComponent } from './components/question/components/add/add.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/components/login/login.component';
import { RegisterComponent } from './components/user/components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    QuestionComponent,
    AddComponent,
    NavBarComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
