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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { EditProfileComponent } from './components/user/components/edit-profile/edit-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { CodeEditorModule } from '@ngstack/code-editor';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
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
    EditProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
    CodeEditorModule.forRoot(),
    HighlightModule,
    InfiniteScrollModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
