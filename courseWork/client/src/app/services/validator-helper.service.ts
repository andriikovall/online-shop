import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorHelperService {
  static stringWithoutRegExpSymbolsValidator(control: FormControl) {
    const valid = !forbiddenRegExpSymbols.some((s) => control.value.includes(s));
    return valid ? null : {
      stringWithoutRegExpSymbolsValidator: {
        valid: valid
      }
    };
  }
}

export const forbiddenRegExpSymbols = ['\\', `*`, `[`, ']', '{', '}', '+'];