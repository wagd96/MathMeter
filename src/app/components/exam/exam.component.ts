import { Component, OnInit } from '@angular/core';

import {ExamService} from '../../services/exam.service';
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  exam: any;
  message = "";
  tests: any;
  existsExam = false;
  containsTest = false;
  isLogin = false;
  user = {
    idStudent: '',
    idGroup: ''
  }
  nameStudent = ''
  minutes: number;
  seconds: number;

  constructor(private exaService: ExamService) { }

  ngOnInit() {
    this.exaService.getExams().subscribe(data => {
      if (data.status === 200) {
        this.existsExam = true;

        const entity = data.entity;
        this.exam = entity.exam;
        this.tests = entity.tests;
        this.minutes = this.exam.duration - 1;
        this.seconds = 59;

        if (this.tests.length > 0) {
          this.containsTest = true
        }
      }
    }, err => {
      console.log('No se conecta a la BD', err);
    });

  }

  login(){
    let idGroup = this.user.idGroup;
    let idStudent = this.user.idStudent;

    this.exaService.getStudentXGroupId(idGroup,idStudent).subscribe(data => {
      this.isLogin = true;
      this.message = "";
      this.nameStudent = data.entity.student__name;
      setInterval(() => this.tick(), 1000);
    }, error => {
      this.isLogin = false;
      this.message = "Credenciales incorrectas.";
      this.nameStudent = "";
    });
  }

  tick() {
    if (--this.seconds < 0) {
      this.seconds = 59
      if(--this.minutes < 0) {
        console.log("Para el timer");
        this.minutes = 0;
        this.seconds = 0;
      }
    }
  }

}
