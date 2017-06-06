import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StudentsService} from "../students/students.service";
import {Student} from "../students/student";
import {Result} from "../results/result";
import {ResultsService} from "../services/results.service";
import {Group} from "../group/group";
import {GroupService} from "../group/group.service";
import {Question} from "./question";
import {QuestionsService} from "../services/questions.service";
import {AnswersService} from "../services/answers.service";
import {Answer} from "./answer";

@Component({
  selector: 'dtester-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css']
})
export class DetailedComponent implements OnInit {

  studentId: number;
  student: Student;
  results: Result[];
  group: Group;
  active_id: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private studentService: StudentsService,
              private resultService: ResultsService, private groupService: GroupService,
              private questionsService: QuestionsService, private answersService: AnswersService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.studentId = params['studentId'];
      this.getStudentById(this.studentId)
    });
    this.getResultsByStudentId(this.studentId);
  }

  getStudentById(id: number) {
    this.studentService.getStudentById(id).subscribe((resp: Student) => {
      this.student = resp[0];
      this.getGroupByStudent(this.student.group_id);
    });
  }

  getResultsByStudentId(id: number) {
    this.resultService.getAllByStudent(id).subscribe((resp: Result[]) => {
      resp.forEach((res: Result) => {
        let strQ = JSON.parse((res.questions).toString().replace(new RegExp('&quot;', 'g'), '\"'));
        let quest: Question[] = [];
        for (let i = 0; i < strQ.length; i++) {
          let question: Question;
          let answers: Answer[] = [];

          for (let j = 0; j < strQ[i].answers.length; j++) {
            this.answersService.getAnswersById(strQ[i].answers[j]).subscribe((a: Answer) => answers.push(a[0]));
          }
          this.questionsService.getQuestionById(strQ[i].question_id).subscribe((q: Question) => {
            question = q[0];
            question['answers'] = answers;
            quest.push(question);
          });

          console.log(quest);
        }
        res['questions'] = quest;
      });
      this.results = resp;
    });
  }

  getGroupByStudent(id: number) {
    this.groupService.getGroupById(id).subscribe((resp: Group) => this.group = resp[0]);
  }

  setActive(i: number) {
    this.active_id = i;
  }

  calcutateTimeInterval(start: string, end: string): string {
    function parseStringIntoDate(s: string): Date {
      let splitS = s.split(':');
      let d: Date = new Date();
      d.setHours(+splitS[0]);
      d.setMinutes(+splitS[1]);
      d.setSeconds(+splitS[2]);
    return d;
    }
    let s: Date = parseStringIntoDate(start);
    let e: Date = parseStringIntoDate(end);
    let interval: number = (e.getTime() - s.getTime()) / 1000;
    let seconds = Math.floor(interval % 60);
    interval /= 60;
    let minutes = Math.floor(interval % 60);
    interval /= 60;
    let hours = Math.floor(interval / 24);
    return [hours, minutes, seconds].join(':');
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
