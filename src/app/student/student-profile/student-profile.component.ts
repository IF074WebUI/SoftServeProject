import { Component, OnInit } from '@angular/core';
import {Student} from "../../admin/students/student";
import {StudentsService} from "../../admin/students/students.service";
import {GroupService} from "../../admin/group/group.service";
import {Group} from "../../admin/group/group";
import {ToastsManager} from "ng2-toastr";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  student: Student;
  group: Group;
  studentId: number;
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService,
    private groupService: GroupService,
    private toastr: ToastsManager
  ) {
  }

  ngOnInit() {
    this.studentId = +this.route.snapshot.queryParams['user_id'];
    this.getStudent(this.studentId);
  }
  getStudent(studentId: number) {
    this.studentService.getStudentById(studentId)
      .subscribe(
        response => {
          this.student = response[0];
          this.groupService.getGroupById(this.student.group_id)
            .subscribe(
              groupResponce => { this.group = groupResponce[0]; },
              error => this.toastr.error(error)
            );
        }, error => this.toastr.error(error)
        );

  }

}
