import { Component, OnInit } from '@angular/core';

import {ExamService} from '../../services/exam.service';
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  exam: any;
  tests: any;
  existsExam = false;
  containsTest = false;

  constructor(private exaService: ExamService) { }

  ngOnInit() {
    this.exaService.getExams().subscribe(data => {
      if (data.status === 200) {
        this.existsExam = true;

        const entity = data.entity;
        this.exam = entity.exam;
        this.tests = entity.tests;

        if (this.tests.length > 0) {
          this.containsTest = true
        }
      }
    }, err => {
      console.log('No se conecta a la BD', err);
    });

  }

}
