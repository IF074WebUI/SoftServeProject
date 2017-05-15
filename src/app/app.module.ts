import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import {routes} from './app.routes';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './admin/menu/menu.component';
import {LoginService} from './login/login.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
