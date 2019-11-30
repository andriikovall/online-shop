import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user.model';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { ValidatorHelperService, forbiddenRegExpSymbols } from '../../services/validator-helper.service';
import { FormHelperService } from 'src/app/services/form-helper.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User;
  mainForm: FormGroup;
  constructor(
    private userService: ApiUsersService,
    private route: ActivatedRoute, 
    private router: Router, 
    private location: Location, 
    public formHelper: FormHelperService, 
  ) { }

  initForm() {
    const basicValidators = [
      Validators.required, 
      Validators.minLength(5), 
      ValidatorHelperService.stringWithoutRegExpSymbolsValidator
    ];

    this.mainForm = new FormGroup({
      userForm: new FormGroup({
        first_name: new FormControl(this.user.first_name, basicValidators), 
        last_name: new FormControl(this.user.last_name, basicValidators), 
        bio_md: new FormControl(this.user.bio_md || '', basicValidators)
      }), 
      shippingForm: new FormGroup({
        contact: new FormControl(this.user.contact), //@todo validate 
        address: new FormControl(this.user.address), 
        postNumber: new FormControl(this.user.postNumber), 
        city: new FormControl(this.user.city)
      })
    });
  }

  ngOnInit() {
    const userToUpdateId = this.route.snapshot.paramMap.get('id');
    this.userService.getById(userToUpdateId).subscribe((res: User) => {
      this.user = res;
      this.user._id = userToUpdateId;
      this.initForm();
    }, (err) => {
      console.error(err);
      this.location.back(); 
    });
  }

  getUserFromForm(formValue) {
    const user = { ...formValue.userForm, ...formValue.shippingForm, _id: this.user._id };
    return user;
  }

  onFormSubmit() {
    const user = this.getUserFromForm(this.mainForm.value);
    this.userService.updateUser(user).subscribe((res) => {
      this.router.navigate(['/users', this.user._id]);
    });
  }

  navigateBack() {
    this.location.back();
  }

}
