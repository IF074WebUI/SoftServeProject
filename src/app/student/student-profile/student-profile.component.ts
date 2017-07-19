import { Component, OnInit } from '@angular/core';
import {Student} from '../../admin/students/student';
import {StudentsService} from '../../admin/students/students.service';
import {GroupService} from '../../admin/group/group.service';
import {Group} from '../../admin/group/group';
import {ToastsManager} from 'ng2-toastr';
import {ActivatedRoute} from '@angular/router';
import {TestPlayerService} from "../test-player/test-player.service";

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  student: Student;
  group: Group;
  studentId: number;
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService,
    private groupService: GroupService,
    private toastr: ToastsManager,
    private test_player: TestPlayerService
  ) {
  }

  ngOnInit() {
this.getStudentId();
    this.getStudent(this.studentId);
  }
  getStudentId () {
    this.test_player.testPlayerIdData
      .subscribe(response => this.studentId = +response.studentId);
  }
  getStudent(studentId: number) {
    this.studentService.getStudentById(studentId)
      .subscribe(
        response => {
          console.log(response[0])
          // this.student = response[0]
          this.student.group_id = +response[0]['group_id'];
          this.student.gradebook_id = response[0]['gradebook_id'];
          this.student.student_surname = response[0]['student_surname'];
          this.student.student_fname = response[0]['student_fname'];
          this.student.student_name = response[0]['student_name'];
          this.groupService.getGroupById(this.student.group_id)
            .subscribe(
              groupResponce => {
                this.student.group_name = groupResponce[0].group_name;
                this.studentService.getAdminUser(this.student.user_id)
                  .subscribe(response => console.log(response));
                },
              error => this.toastr.error(error)
            );
        }, error => this.toastr.error(error)
        );

  }

}
