import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import dayjs from 'dayjs';

@ValidatorConstraint({ async: false })
export class IsAfterOrToday implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    const date = dayjs.unix(value);
    return date.isAfter(dayjs().startOf('day'));
  }

  defaultMessage(): string {
    return 'The start date cannot be earlier than today.';
  }
}
