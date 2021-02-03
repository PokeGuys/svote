import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValid } from 'src/util/hkid.extractor';

@ValidatorConstraint({ async: false })
export class IsValidHKID implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return isValid(value);
  }

  defaultMessage(): string {
    return 'The text field must be a valid HKID number.';
  }
}
