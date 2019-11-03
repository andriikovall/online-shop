import { Injectable } from '@angular/core';

import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class FormHelperService {

  constructor() { }

  public isInvalidFormControl(control: string, form: FormGroup) {
    const item = form.get(control);
    if (!item) return true;
    return item.invalid && (item.dirty || item.touched);
  }
}
