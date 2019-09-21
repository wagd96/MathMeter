import { Component, OnInit, Input } from '@angular/core';
import { ExamService } from '../../../services/exam.service'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})

export class QuestionComponent implements OnInit {
  @Input() tests: any;
  @Input() user: any;
  @Input() exam: any;
  paragraph = ``;
  btnMessage = "Enviar y Continuar";
  currentQuestion = 1;
  totalQuestion: number;
  studenAnswers = [];
  answer = 0;
  btnDisabled = "";
  minutes: number;
  seconds: number;
  timer = null;

  constructor(private exaService: ExamService) { }

  ngOnInit() {
    this.totalQuestion = this.tests.length;
    this.paragraph = this.tests[this.currentQuestion - 1].problem.question;
    this.minutes = this.exam.duration - 1;
    this.seconds = 59;
    this.timer = setInterval(() => this.tick(), 1000);
  }

  changeQuestion() {
    let studentAnswer = {
      id_student: this.user.idStudent,
      id_group: this.user.idGroup,
      id_test: 0,
      failed: true,
      date: new Date().toISOString().split("T")[0]
    }
    if (this.currentQuestion == this.totalQuestion) {
      studentAnswer.id_test = this.tests[this.currentQuestion - 1].test.id;
      if (this.answer == this.tests[this.currentQuestion - 1].problem.answer) {
        studentAnswer.failed = false
      } else {
        studentAnswer.failed = true;
      }
      this.studenAnswers.push(studentAnswer);
      this.btnDisabled = "true";

      this.exaService.insertStudentAnswers(this.studenAnswers).subscribe(data => {
        console.log("Mostrar las pinches estadisticas");
      }, error => {
        console.log(error);
      });
    } else {
      studentAnswer.id_test = this.tests[this.currentQuestion - 1].test.id;
      if (this.answer == this.tests[this.currentQuestion - 1].problem.answer) {
        studentAnswer.failed = false
      } else {
        studentAnswer.failed = true;
      }
      this.studenAnswers.push(studentAnswer);
      this.currentQuestion += 1;

      if (this.currentQuestion == this.totalQuestion) {
        this.btnMessage = "Finalizar prueba";
      }
      this.paragraph = this.tests[this.currentQuestion - 1].problem.question;
      this.answer = 0;
    }
  }

  tick() {
    if (--this.seconds < 0) {
      clearInterval(this.timer);
      this.seconds = 59
      if (--this.minutes < 0) {
        this.minutes = 0;
        this.seconds = 0;
      }
    }
  }
}
