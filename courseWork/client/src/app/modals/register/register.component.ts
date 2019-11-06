import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormHelperService } from '../../services/form-helper.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  passwordsEqual: boolean = false;
  loginAlreadyExists: boolean = false;

  constructor(
    public modal: NgbActiveModal, 
    public formHelper: FormHelperService, 
    public auth: AuthService

  ) { }

  ngOnInit() {
    const validators = [
      Validators.required, 
      Validators.minLength(5),
      Validators.maxLength(30), 
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

  registerClicked() {
    if (!(this.registerForm.valid && this.passwordsEqual)) 
      return;
    console.log(this.registerForm.value);
    this.auth.register(this.registerForm.value).subscribe(response => {
      this.modal.close(true);
      this.loginAlreadyExists = false;
    }, 
    err => {
      console.log(err);
      if (err.status == 409)
        this.loginAlreadyExists = true;
    })
  }


}
