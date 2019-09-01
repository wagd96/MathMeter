import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { KatexModule } from 'ng-katex';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ExamComponent } from './components/exam/exam.component';
import { HomeComponent } from './components/home/home.component';
import { QuestionComponent } from './components/exam/question/question.component';

import { ExamService } from '../app/services/exam.service'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ExamComponent,
    HomeComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    KatexModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  providers: [ExamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
