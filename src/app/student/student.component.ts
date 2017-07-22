import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login/login.service';
import {Router} from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import {ToastsManager} from 'ng2-toastr';
import {SpinnerService} from '../admin/universal/spinner/spinner.service';
import {ViewContainerRef} from '@angular/core';
//
// export class User {
//   id: number;
//   name: string;
//   username: string;
// }

export class Color {
  name: string;
}

class item {
  name: string;
  val: number;
}

@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})

export class StudentComponent implements OnInit {
  objLoaderStatus: boolean;



  // items: item[] = [{name: 'One', val: 1}, {name: 'Two', val: 2}, {name: 'Three', val: 3}, {name: 'Four', val: 4}];

  items: item[] = [{name: 'One', val: 1}, {name: 'Two', val: 2}, {name: 'Three', val: 3}, {name: 'Four', val: 4}];
  selectedValue: string= 'One';


 colors: Color[] = [
   {name: 'orangeTheme'},
   {name: 'pinkTheme'}
 ];

//   colorTheme = 'red';
//
//   users: User[] = [
//     { id: 25, name: 'Chris', username: 'sevilayha' },
//     { id: 26, name: 'Nick', username: 'whatnicktweets' },
//     { id: 27, name: 'Holly', username: 'hollylawly' }
//   ];
//   activeUser: User;
// color = 'orangeTheme';



  // colors: Color[] = [
  //    { name: 'pinkTheme' },
  //    { name: 'orangeTheme' },
  //    { name: 'redTheme' }
  //  ];
  //
  //
  //  colorTheme = "orangeTheme";
  // colorTheme = this.getTheme();
  // public my_Class = 'pink';
  // public my_Class2 = 'pink';

  // rcolor=this.getColor();
  //
  // public font_size="12px";
  // public background_color="grey ";

  constructor(private loginService: LoginService,
              private router: Router,
              private spinner: SpinnerService,
              public  vRef: ViewContainerRef,
              private toastr: ToastsManager,


  ) {
    this.toastr.setRootViewContainerRef(vRef);

  }

  ngOnInit() {
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
    });

  }
  logout() {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  // selectUser(user) {
  //   this.activeUser = user;
  //   console.log(this.activeUser);
  // }


  // getTheme(redTheme: string) {
  //   this.my_Class3 = 'redTheme';
  // }
  // setTheme(){
  //
  // }
  // setColor(){
  //   this.randomcolor=this.getRandomColor();
  // }

  // getColor() {
  //   var color = "red";
  //   return color;
  // }
  // setColor() {
  //   this.rcolor = this.getColor();
  // }

  // toggle_class() {
  //   if (this.my_Class == 'pink') {
  //     this.my_Class = 'pinkTheme';
  //   }
  // }
  // toggle_class2() {
  //   if (this.my_Class2 == 'pink') {
  //     this.my_Class2 = 'orangeTheme';
  //   }
  // }




   //
   // setTheme(color: string) {
   //    this.colorTheme = color;
  //   if (this.colorTheme == 'red') {
  //         this.colorTheme = 'pinkTheme';
  //       }
 //  }
  //
  // isSelected(color: string) {
  //   return this.colorTheme === color;
  // }

}
