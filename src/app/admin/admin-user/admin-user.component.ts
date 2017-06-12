import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminUser } from './admin-user';
import {AdminUserService} from './admin-user.service';
import { Router } from '@angular/router';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { ADMINUSER_CONFIG } from '../universal/dynamic-form/config';


@Component({
  selector: 'dtester-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  providers: [AdminUserService]
})
export class AdminUserComponent implements OnInit {

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;

  configs = ADMINUSER_CONFIG;
  AdminUsers: AdminUser[] = [];
  count: number;
  page = 1;
  countPerPage = 5;
  headers = ['№', 'E-mail', 'Логін'];
  ignoreProperties = ['password', 'logins', 'last_login'];
  displayProperties = ['email', 'username'];
  sortProperties = ['email', 'username'];

  constructor(private AdminUserService: AdminUserService, private router: Router) { }

  ngOnInit() {
    this.getAdmins();
  }

  getCount(): void {
    this.AdminUserService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  getAdmins() {
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.getCount();
    this.AdminUserService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe((resp: AdminUser[]) => this.AdminUsers = resp,
        err => this.router.navigate(['/bad_request'])
      );
  }

  changePage(page: number) {
    this.page = page;
    this.getAdmins();
  }

  edit(AdminUser: AdminUser) {
    console.log(AdminUser);
    this.popup.sendItem(
      {
        email: AdminUser.email,
        id: AdminUser.id,
        username: AdminUser.username
      }
    );
    this.popup.showModal();
  }

  del(AdminUser: AdminUser) {
    this.popup.deleteEntity(AdminUser);
  }

  add() {
    this.popup.sendItem(new AdminUser());
    this.popup.showModal();
  }

  formSubmitted(value) {
    console.log(value);
    if (value['id']) {
      this.AdminUserService.update(value['id'], value['username'], value['email']).subscribe(resp => {
        this.getAdmins();
        this.popup.cancel();
      }, error2 => this.router.navigate(['/bad_request']));
    } else {
      this.AdminUserService.insert(value).subscribe(resp => {
        this.getAdmins();
        this.popup.cancel();
      }, error2 => this.router.navigate(['/bad_request']));
      // }
    }
  }

  submitDelete(AdminUser: AdminUser) {
    this.AdminUserService.delete(AdminUser['id']).subscribe(response => this.getAdmins(),
      error => this.router.navigate(['/bad_request'])
    );
  }
}
