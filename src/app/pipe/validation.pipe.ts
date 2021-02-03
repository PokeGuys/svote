import { ArgumentMetadata, Injectable, PipeTransform, ValidationError } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exception/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const isPrimitive = this.isPrimitive(value);
    let entity = plainToClass(metatype, value);
    const isCtorNotEqual = entity.constructor !== metatype;
    if (isCtorNotEqual && !isPrimitive) {
      entity.constructor = metatype;
    } else if (isCtorNotEqual) {
      // when "entity" is a primitive value, we have to temporarily
      // replace the entity to perform the validation against the original
      // metatype defined inside the handler
      entity = { constructor: metatype };
    }
    const errors = await validate(entity);
    if (errors.length > 0) {
      throw new ValidationException('validation-error', this.buildError(errors));
    }
    return value;
  }

  private buildError(errors: ValidationError[]) {
    const result = {};
    errors.forEach(({ property, constraints }) => {
      Object.entries(constraints).forEach((constraint) => {
        result[property] = constraint[1];
      });
    });
    return result;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private isPrimitive(value: unknown): boolean {
    return ['number', 'boolean', 'string'].includes(typeof value);
  }
}
