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
  studentAnswers = [];
  answer = 0;
  btnDisabled = "";
  minutes: number;
  seconds: number;
  timer = null;

  constructor(private exaService: ExamService) { }

  ngOnInit() {
    this.totalQuestion = this.tests.length;
    this.paragraph = this.tests[this.currentQuestion - 1].problem.question;
    this.minutes = this.exam.duration;
    this.seconds = 0;
    this.timer = setInterval(() => this.tick(), 1000);
  }

  changeQuestion() {
    let studentAnswer = {
      id_student: this.user.idStudent,
      id_group: this.user.idGroup,
      id_test: this.tests[this.currentQuestion - 1].test.id,
      failed: true,
      date: new Date().toISOString().split("T")[0]
    }

    if (this.currentQuestion == this.totalQuestion) {
      if (this.answer == this.tests[this.currentQuestion - 1].problem.answer) {
        studentAnswer.failed = false
      } else {
        studentAnswer.failed = true;
      }
      this.studentAnswers.push(studentAnswer);
      this.btnDisabled = "true";
      this.saveStudentAnswers();
      clearInterval(this.timer);

    } else {
      if (this.answer == this.tests[this.currentQuestion - 1].problem.answer) {
        studentAnswer.failed = false
      } else {
        studentAnswer.failed = true;
      }
      this.studentAnswers.push(studentAnswer);
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
      this.seconds = 59;
      if (--this.minutes < 0) {
        this.fillStudentAnswers();
        clearInterval(this.timer);
        this.minutes = 0;
        this.seconds = 0;
      }
    }
  }

  saveStudentAnswers() {
    this.exaService.insertStudentAnswers(this.studentAnswers).subscribe(data => {
      if (data.status == 200) {
        //Mostrar las estadisticas
        console.log("Datos guardados con éxito");
      } else {
        console.log('No es el status code');
      }
    }, err => {
      console.log("Problemas en la conexión a la BD", err)
    });
  }

  fillStudentAnswers() {
    this.btnDisabled = "true";
    for (let i = this.currentQuestion; i <= this.totalQuestion; i++) {
      let studentAnswer = {
        id_student: this.user.idStudent,
        id_group: this.user.idGroup,
        id_test: this.tests[i - 1].test.id,
        failed: true,
        date: new Date().toISOString().split("T")[0]
      }

      this.studentAnswers.push(studentAnswer);
    }
    this.saveStudentAnswers();
  }
}
