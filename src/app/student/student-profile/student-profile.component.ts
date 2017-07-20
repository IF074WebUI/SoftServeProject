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
// this.getStudentId();
//     this.getStudent(this.studentId);
  this.getStudentData();
  }
  getStudentId () {
    this.test_player.testPlayerIdData
      .subscribe(response => this.studentId = +response.studentId);
  }
  getStudentData() {
    this.test_player.getStudentData()
      .subscribe( data => {
        this.student = data;
        this.groupService.getGroupById(this.student.group_id)
          .subscribe(response => {
            console.log(response)
            this.student.group_name = response[0].group_name;
          }, error => this.toastr.error(error));
      });
  }

}
