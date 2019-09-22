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

  //Datos para la estadistica
  public barChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }, 
    scales: {
      yAxes: [{
           ticks: {
              min: 0,
              stepSize: 1,
          }
      }]
  }
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [];

  paragraph = ``;
  btnMessage = "Enviar y Continuar";
  currentQuestion = 1;
  totalQuestion: number;
  studentAnswers = [];
  wrongs = [];
  corrects = [];
  answer = 0;
  btnDisabled = "";
  minutes: number;
  seconds: number;
  timer = null;
  showS = false;

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

  //Funcion de ejecución en el timer
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
        this.showStatistisc();
      } else {
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

  showStatistisc() {
    let subcats = [];
    this.corrects = [];
    this.wrongs = [];

    //Tomar los nombres de las subcategorias
    this.tests.forEach(test => {
      const nameSubCat = test.test.aspect__sub_cat_id__name;
      if(! subcats.includes(nameSubCat)) {
        subcats.push(nameSubCat)
      }
    });

    //Para cada subcategoria tomar las buenas y las malas
    subcats.forEach(subcat => {
      let testsIds = [];
      let accert = 0;
      let wrong = 0;

      this.tests.forEach(test => {
        const nameSubCat = test.test.aspect__sub_cat_id__name;
        const id = test.test.id
        if(subcat == nameSubCat) {
          testsIds.push(id);
        }
      });

      this.studentAnswers.forEach(answer => {
        if(testsIds.includes(answer.id_test)) {
          if(answer.failed) {
            wrong += 1;
          } else {
            accert += 1;
          }
        }
      });
      this.wrongs.push(wrong);
      this.corrects.push(accert);
    });

    this.barChartLabels = subcats;
    this.barChartData = [
      { data: this.wrongs, label: 'Incorrectas' },
      { data: this.corrects, label: 'Correctas' },
    ];
    this.showS = true;
  }
}
