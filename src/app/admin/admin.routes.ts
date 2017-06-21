import { Route} from '@angular/router';
import { AdminComponent } from './admin.component';
import { GroupComponent } from './group/group.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FacultiesComponent } from './faculties/faculties.component';
import { SubjectComponent } from './subject/subject.component';
import { TimetableComponent } from './timetable/timetable.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { StudentsComponent } from './students/students.component';
import { ResultsComponent } from './results/results.component';
import { TestsComponent } from './tests/tests.component';
import { DetailedResultsComponent} from './detailed-results/detailed-results.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { QuestionsComponent } from './questions/questions.component';
import {AnswersComponent} from './answers/answers.component';

export const adminRoutes: Route[] = [
  {
    path: '', component: AdminComponent,
    children: [
      {path: '', redirectTo: 'statistics', pathMatch: 'full'},
      {path: 'group', component: GroupComponent},
      {path: 'statistics', component: StatisticsComponent},
      {path: 'faculties', component: FacultiesComponent},
      {path: 'subject', component: SubjectComponent},
      {path: 'timetable', component: TimetableComponent},
      {path: 'specialities', component: SpecialitiesComponent},
      {path: 'results', component: ResultsComponent},
      {path: 'students', component: StudentsComponent},
      {path: 'results/:studentId', component: DetailedResultsComponent},
      {path: 'results', component: ResultsComponent},
      {path: 'students/:user_id', component: StudentProfileComponent},
      {path: 'subject/tests', component: TestsComponent},
      {path: 'subject/tests/testDetails', component: TestDetailComponent},
      {path: 'admin-user', component: AdminUserComponent},
      {path: 'subject/tests/questions', component: QuestionsComponent},
      {path: 'subject/tests/questions/answers', component: AnswersComponent}
    ]
  }];
