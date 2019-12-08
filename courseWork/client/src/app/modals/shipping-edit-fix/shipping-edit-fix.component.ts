import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormHelperService } from 'src/app/services/form-helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-shipping-edit-fix',
  templateUrl: './shipping-edit-fix.component.html',
  styleUrls: ['./shipping-edit-fix.component.css']
})
export class ShippingEditFixComponent implements OnInit {

  constructor(
    private userService: ApiUsersService,
    public modal: NgbActiveModal,
    public formHelper: FormHelperService,
    private alerts: AlertService, 
    private auth: AuthService
  ) { }

  shippingForm: FormGroup;
  user: User;

  ngOnInit() {
    this.fetchUser();
  }

  initForm() {
    const basicValidators = [
      Validators.required,
      Validators.minLength(5),
    ];

    this.shippingForm = new FormGroup({
      contact: new FormControl(this.user.contact || this.user.telegramId, [Validators.minLength(2), Validators.maxLength(50), Validators.required]),
      city: new FormControl(this.user.city, [Validators.minLength(2), Validators.maxLength(50), Validators.required]),
      address: new FormControl(this.user.address, basicValidators.concat([Validators.maxLength(100), Validators.required])),
      postNumber: new FormControl(this.user.postNumber, [Validators.max(999), Validators.required]),
    })
  }

  fetchUser() {
    const userid = this.auth.userId;
    if (!userid) {
      this.alerts.error('Вы не авторизированы, случилась ошибка');
    }
    this.userService.getById(userid).subscribe((res: User) => {
      this.user = res;
      this.initForm();
    }, err => {
      console.log(err);
      this.alerts.error('Случилась ошибка на сервере, попробуйте позже');
    });
  }

  onConfirm() {
    for (const key in this.shippingForm.value) {
      this.user[key] = this.shippingForm.value[key];
    }
    
    this.userService.updateUser(this.user).subscribe(res => {
      this.modal.close(true);
    }, err => {
      console.error(err);
      this.alerts.error('Ошибка сервера, попробуйте позже');
    })
  }

  onDeny() {
    this.modal.close(false);
  }

}
