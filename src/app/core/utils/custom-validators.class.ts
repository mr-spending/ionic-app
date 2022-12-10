import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static matchControls(controlName1: string, controlName2: string): ValidatorFn {
    return (form: AbstractControl) : ValidationErrors | null => {
      const control1 = form.get(controlName1);
      const control2 = form.get(controlName2);
      return control1?.value === control2?.value ? null : { notMatches: true };
    }
  }

  static includes<T>(list: T[]): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const value = control.value;
      return !list.includes(value) ? { notIncludes: true } : null;
    }
  }

}
