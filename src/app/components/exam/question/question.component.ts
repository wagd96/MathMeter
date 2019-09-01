import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})

export class QuestionComponent implements OnInit {
  @Input() tests : any;
  paragraph = ``;
  currentQuestion = 1;
  totalQuestion : number;
  studenAnswers = [];
  studentAnswer = {
    id_student: 1,
    id_group: 1,
    id_test: 0,
    faied: true,
    date: ""
  };
  answer = 0;
  frase = "";
  failed = [];
  constructor() { }

  ngOnInit() {
    this.totalQuestion = this.tests.length;
    this.paragraph = this.tests[this.currentQuestion - 1].problem.question;
  }

  changeQuestion() {
    if (this.currentQuestion > this.totalQuestion) {
      console.log("No se avanza");
      console.log(this.studenAnswers);
      return;
    }
    this.studentAnswer.id_test = this.tests[this.currentQuestion - 1].test.id;
    if (this.answer == this.tests[this.currentQuestion - 1].problem.answer) {
      this.studentAnswer.faied = false
      this.frase = "Correcto.";
    } else {
      this.frase = "Incorrecto";
      this.studentAnswer.faied = true;
      this.failed.push(this.currentQuestion - 1);
    }
    this.studenAnswers.push(this.studentAnswer);
    this.currentQuestion += 1;

    if(this.currentQuestion > this.totalQuestion) {
      console.log(this.failed);
      return;
    }
    this.paragraph = this.tests[this.currentQuestion - 1].problem.question;

    //Resetear la pregunta
    this.studentAnswer = {
      id_student: 1,
      id_group: 1,
      id_test: 0,
      faied: true,
      date: ""
    };
    this.answer = 0;
  }

}
