import { HttpClient } from '@angular/common/http';

const url = 'http://mathmeter.pythonanywhere.com/api/';
export class ExamService {
  constructor(private http: HttpClient) { }

  getExams() {
    return this.http.get<any>(url + 'exams/1');
  }

  insertStudentAnswers(answers: any) {
    return this.http.post<any>(url + 'studentAnswers', {answers, option:0});
  }
}
