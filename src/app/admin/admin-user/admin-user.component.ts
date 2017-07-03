import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminUser } from './admin-user';
import {AdminUserService} from './admin-user.service';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { ADMINUSER_CONFIG } from '../universal/dynamic-form/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';


@Component({
  selector: 'dtester-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  providers: [AdminUserService]
})
export class AdminUserComponent implements OnInit {

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;

  MODAL_ADD = 'Додати адміністратора';
  HEADER  = 'Адміністратори';
  MODAL_REQUIRED = 'Поле обов\'язкове до заповнення';
  configs = ADMINUSER_CONFIG;
  AdminUsers: AdminUser[] = [];
  count: number;
  page = 1;
  countPerPage = 5;
  headers = ['№', 'E-mail', 'Логін'];
  ignoreProperties = ['password', 'logins', 'last_login'];
  displayProperties = ['email', 'username'];
  sortProperties = ['email', 'username'];
  AdminForEditForm: FormGroup;
  AdminForEdit: AdminUser;

  constructor(private AdminUserService: AdminUserService, private router: Router,
              private spinner: SpinnerService, private toastr: ToastsManager) { }

  ngOnInit() {
    this.getAdmins();
    this.AdminForEditForm = new FormGroup ({
      'email': new FormControl('', Validators.required),
      'username': new FormControl('', Validators.required)
    });
  }

  getCount(): void {
    this.AdminUserService.getCount().subscribe(resp => {
      this.count = resp;
    }, err => {
      this.toastr.error(err);
    });
  }

  getAdmins() {
    this.spinner.showSpinner();
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.getCount();
    this.AdminUserService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe((resp: AdminUser[]) => {
        this.AdminUsers = resp;
        this.spinner.hideSpinner();
      }, err => this.router.navigate(['/bad_request'])
      );
  }

  changePage(page: number) {
    this.page = page;
    this.getAdmins();
  }

  selectedAdmin(Admin) {
    this.AdminForEdit = Admin;
    this.AdminForEditForm.setValue({
      email: this.AdminForEdit.email,
      username: this.AdminForEdit.username
    });
  }

  edit() {
    this.AdminUserService.update(this.AdminForEditForm.value , this.AdminForEdit.id).subscribe(resp => {
        this.getAdmins();
      });
  }

  del(AdminUser: AdminUser) {
    this.popup.deleteEntity(AdminUser);
  }

  add() {
    this.popup.sendItem(new AdminUser());
    this.popup.showModal();
  }

  formSubmitted(value) {
    this.AdminUserService.insert(value).subscribe(resp => {
      this.getAdmins();
      this.popup.cancel();
      this.toastr.success(`Адміністратор ${value['username']} успішно створений`);
    }, error2 => {
      this.toastr.error(error2);
    });
  }

  submitDelete(AdminUser: AdminUser) {
    this.AdminUserService.del(AdminUser['id']).subscribe(response => {
      this.getAdmins();
      this.toastr.success(`Адміністратор ${AdminUser['username']} успішно видалений`);
    },  error => {
      this.toastr.error(error);
    });
  }

  changeCountPerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getAdmins();
  }
}
