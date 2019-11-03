import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormHelperService } from '../../services/form-helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  passwordsEqual: boolean = false;

  constructor(
    public modal: NgbActiveModal, 
    public formHelper: FormHelperService

  ) { }

  ngOnInit() {
    const validators = [
      Validators.required, 
      Validators.minLength(5),
      Validators.maxLength(20), 
    ];

    this.registerForm = new FormGroup({
      first_name: new FormControl('', validators),
      last_name: new FormControl('', validators),
      login: new FormControl('', validators),
      password: new FormControl('', validators), 
      passwordRepeat: new FormControl('', validators)
    });
  }

  comparePasswords() {
    const password =       this.registerForm.get('password').value;
    const passwordRepeat = this.registerForm.get('passwordRepeat').value;

    this.passwordsEqual = (password === passwordRepeat);
  }


}
