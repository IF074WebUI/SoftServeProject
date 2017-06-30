import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { studentRoutes } from './student.routes';
import { StudentComponent } from './student.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TestPlayerComponent } from './test-player/test-player.component';
import { StudentsService } from '../admin/students/students.service';
import { ResultsService } from '../admin/services/results.service';
@NgModule({
  declarations: [StudentComponent, TestPlayerComponent],
  imports: [RouterModule.forChild(studentRoutes)],
  providers: [
    StudentsService,
    ResultsService
  ]
})
export class StudentModule {
}


