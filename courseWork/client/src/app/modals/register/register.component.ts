import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormHelperService } from '../../services/form-helper.service';
import { AuthService } from '../../services/auth/auth.service';
import { ValidatorHelperService, forbiddenRegExpSymbols } from 'src/app/services/validator-helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  passwordsEqual: boolean = false;
  loginAlreadyExists: boolean = false;

  forbiddenSymbols = forbiddenRegExpSymbols;

  constructor(
    public modal: NgbActiveModal, 
    public formHelper: FormHelperService, 
    public auth: AuthService,
  ) { }

  ngOnInit() {
    const validators = [
      Validators.required, 
      Validators.minLength(5),
      Validators.maxLength(30), 
    ];

    console.log(this.forbiddenSymbols);

    const loginAndNameValidators = validators.concat(ValidatorHelperService.stringWithoutRegExpSymbolsValidator);
    console.log(loginAndNameValidators);
    this.registerForm = new FormGroup({
      first_name: new FormControl('', loginAndNameValidators),
      last_name: new FormControl('', loginAndNameValidators),
      login: new FormControl('', loginAndNameValidators),
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
    this.registerForm.markAllAsTouched();
    if (!(this.registerForm.valid && this.passwordsEqual)) 
      return;
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
