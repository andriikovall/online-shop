import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { FormHelperService } from '../../services/form-helper.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  isInvalidLoginOrPassword: boolean = false;

  constructor(
    public modal: NgbActiveModal, 
    public formHelper: FormHelperService, 
    private auth: AuthService
  ) { }

  ngOnInit() {
    const validators = [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)
    ];
    this.loginForm = new FormGroup({
      login: new FormControl('', validators),
      password: new FormControl('', validators)
    });
  }

  public login() {
    if (!this.loginForm.valid)
      return;
    this.auth.login(this.loginForm.value).subscribe(res => {
      this.modal.close(true);
      this.isInvalidLoginOrPassword = false;
    }, err => {
      if (err.status == 404 || err.status == 401) {
        this.isInvalidLoginOrPassword = true;
      }
      console.log(err);
    })
  }

}
