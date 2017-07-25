import { Component, OnInit } from '@angular/core';
import { Student } from '../../admin/students/student';
import { StudentsService } from '../../admin/students/students.service';
import { GroupService } from '../../admin/group/group.service';
import { Group } from '../../admin/group/group';
import { ToastsManager } from 'ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import { TestPlayerService } from '../test-player/test-player.service';

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  student: Student;
  group: Group;
  studentId: number;
  FULL_NAME =  'ПІБ';
  GROUP_NAME = 'Група';
  GRADEBOOK = 'Номар заліковки';
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService,
    private groupService: GroupService,
    private toastr: ToastsManager,
    private test_player: TestPlayerService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  this.getStudentData();
  }
  getStudentData() {
    this.test_player.getStudentData()
      .subscribe( data => {
        if (data.student_name === undefined) {
          this.router.navigate(['student/student-main']);
        } else {
          this.student = data;
          this.groupService.getGroupById(this.student.group_id)
            .subscribe(response => {
              this.student.group_name = response[0].group_name;
            }, error => this.toastr.error(error));
        }
      });
  }

}
