import { Component } from '@angular/core';
import {LoginService} from '../login/login.service';
import {Router} from '@angular/router';
import { StudentsService } from '../admin/students/students.service';
import {ResultsService} from "../admin/services/results.service";
@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {
studentId: number;
constructor(private loginService: LoginService,
            private router: Router,
            private studentService: StudentsService,
            private resultsService: ResultsService
) {
  this.studentId = +window.sessionStorage.getItem('studentId');
}

ngOnInit() {

}
saveGroupId() {
  console.log(window.sessionStorage.getItem('studentId'));
}
getTestForStudent() {
  this.studentService.getStudentById(this.studentId).subscribe(res => console.log(res));
}
logout() {
  this.loginService.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
