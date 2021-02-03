import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as dayjs from 'dayjs';

@ValidatorConstraint({ async: false })
export class IsAfterDate implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const dto = args.object as any;
    const [propertyName] = args.constraints;
    const startDate = dayjs.unix(dto[propertyName]);
    const endDate = dayjs.unix(value);
    return dto.hasOwnProperty(propertyName) && endDate.isAfter(startDate);
  }

  defaultMessage(): string {
    return 'The end date must be after start date';
  }
}
