import { HttpClient } from '@angular/common/http';

const url = 'https://mathmeter.pythonanywhere.com/api/';
export class ExamService {
  constructor(private http: HttpClient) { }

  getExams() {
    return this.http.get<any>(url + 'exams/1');
  }

  insertStudentAnswers(answers: any) {
    return this.http.post<any>(url + 'studentAnswers', {answers, option:0});
  }

  getStudentXGroupId(idGroup, idStudent) {
    return this.http.post<any>(url +'studentsxgroups',{
      id_student: idStudent,
      id_group: idGroup,
      option: 1
    });
  }
}
