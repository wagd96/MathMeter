import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  title = 'latexLibrary';
  equation = '';
  paragraphs = [];
  paragraph = ``;
  currentQuestion = 1;

  constructor() {
    for (let i = 1; i <= 20; i++) {
      this.paragraphs.push(
        `Responda la pregunta de $x ^ {${i}} + ${i}$
      La respuesta está en terminos de  $$\\sum_{i=1}^n(x_i^2 - \\overline{x}^2)$$.`);
    }

    this.paragraph = this.paragraphs[this.currentQuestion - 1];
  }

  ngOnInit() {

  }
  changeQuestion(boolean: boolean) {

    if (!boolean) {
      if (this.currentQuestion === 1) {
        return;
      } else {
        this.currentQuestion -= 1;
        this.paragraph = this.paragraphs[this.currentQuestion - 1];
      }
    } else {
      if (this.currentQuestion === 20) {
        return;
      } else {
        this.currentQuestion += 1;
        this.paragraph = this.paragraphs[this.currentQuestion - 1];
      }
    }
  }

}
