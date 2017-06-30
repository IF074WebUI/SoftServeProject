import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { studentRoutes } from './student.routes';
import { StudentComponent } from './student.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TestPlayerComponent} from './test-player/test-player.component';
@NgModule({
  declarations: [StudentComponent, TestPlayerComponent],
  imports: [RouterModule.forChild(studentRoutes)]
})
export class StudentModule {
}


