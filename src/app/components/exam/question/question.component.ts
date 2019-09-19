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
  @Input() aspects: any;
  paragraph = ``;
  btnMessage = "Enviar y Continuar";
  currentQuestion = 1;
  totalQuestion: number;
  studenAnswers = [];
  answer = 0;
  btnDisabled = "";
  finish = true;

  barChartType = 'bar';
  barChartLabels = [];
  barChartData = [];
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{stacked: true }]
    }
  };
  barChartLegend = true;
  answerGood = 0;
  answerBad = 0;

  constructor(private exaService: ExamService) { }

  ngOnInit() {
    this.totalQuestion = this.tests.length;
    this.paragraph = this.tests[this.currentQuestion - 1].problem.question;
    this.barChartLabels = ['subcat 1', 'subcat 2', 'subcat 3']

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
        studentAnswer.failed = false;
        this.answerGood++;
      } else {
        studentAnswer.failed = true;
        this.answerBad++;
      }
      this.studenAnswers.push(studentAnswer);
      this.btnDisabled = "true";


      this.exaService.insertStudentAnswers(this.studenAnswers).subscribe(data => {
        console.log("Mostrar las pinches estadisticas");
        this.barChartData = [
          { data: [this.answerGood, this.currentQuestion, 3],backgroundColor:'green', 
          borderColor:'black', label: 'Preguntas acertadas' },
          { data: [this.answerBad, this.currentQuestion, 2],backgroundColor:'red', 
          borderColor:'black', label: 'Preguntas erradas' }
        ];
        this.finish = false;
      }, error => {
        console.log(error);
      });
    } else {
      studentAnswer.id_test = this.tests[this.currentQuestion - 1].test.id;
      if (this.answer == this.tests[this.currentQuestion - 1].problem.answer) {
        studentAnswer.failed = false;
        this.answerGood += 1;
      } else {
        studentAnswer.failed = true;
        this.answerBad++;
      }
      this.studenAnswers.push(studentAnswer);
      this.currentQuestion += 1;

      if (this.currentQuestion == this.totalQuestion) {
        this.btnMessage = "Finalizar prueba";
      }
      this.paragraph = this.tests[this.currentQuestion - 1].problem.question;
      this.answer = 0;
      this.finish = true;
    }
  }

  subCategorie(idAspect) {
    this.exaService.getSubCategories(idAspect).subscribe(data => {
      console.log(data);
    }, error => {
      console.log("malo");
    });

  }

}
