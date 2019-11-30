import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user.model';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { ConfirmSafetyComponent } from '../../modals/confirm-safety/confirm-safety.component';

import { ValidatorHelperService, forbiddenRegExpSymbols } from '../../services/validator-helper.service';
import { FormHelperService } from 'src/app/services/form-helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User;
  mainForm: FormGroup;

  imageSrc;

  constructor(
    private userService: ApiUsersService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public formHelper: FormHelperService,
    private modalService: NgbModal,
  ) { }

  initForm() {
    const basicValidators = [
      Validators.required,
      Validators.minLength(5),
      ValidatorHelperService.stringWithoutRegExpSymbolsValidator
    ];

    const nameValifators = basicValidators.concat(Validators.maxLength(30));

    this.mainForm = new FormGroup({
      userForm: new FormGroup({
        first_name: new FormControl(this.user.first_name, nameValifators),
        last_name: new FormControl(this.user.last_name, nameValifators),
        bio_md: new FormControl(this.user.bio_md || '', basicValidators)
      }),
      shippingForm: new FormGroup({
        contact: new FormControl(this.user.contact, [Validators.minLength(2), Validators.maxLength(50), Validators.required]), //@todo validate 
        city: new FormControl(this.user.city, [Validators.minLength(2), Validators.maxLength(50), Validators.required]),
        address: new FormControl(this.user.address, basicValidators.concat([Validators.maxLength(100), Validators.required])),
        postNumber: new FormControl(this.user.postNumber, [Validators.max(999), Validators.required]),
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
    const user = {
      ...formValue.userForm,
      ...formValue.shippingForm,
      _id: this.user._id, 
    };

    if (this.imageSrc)
      user.file = this.imageSrc;

    return user;
  }

  onFormSubmit() {
    if (!this.mainForm.valid)
      return;
    const user = this.getUserFromForm(this.mainForm.value);
    this.modalService.open(ConfirmSafetyComponent).result.then((res) => {
      if (res) {
        this.userService.updateUserFormData(user).subscribe((res) => {
          this.router.navigate(['/users', this.user._id]);
        });
      }
    }, console.log)
  }

  navigateBack() {
    this.location.back();
  }

  onImageSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

}
