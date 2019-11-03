import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormHelperService } from '../../services/form-helper.service';

import { RegisterComponent } from '../register/register.component';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public modal: NgbActiveModal, 
    public formHelper: FormHelperService, 
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    const validators = [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ];
    this.loginForm = new FormGroup({
      login: new FormControl('', validators),
      password: new FormControl('', validators)
    });
  }

  public isInvalidFormControl(control: string) {
    const item = this.loginForm.get(control);
    return item.invalid && (item.dirty || item.touched);
  }

}
