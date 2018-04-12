import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  QueryFailedError
} from 'typeorm';
import { validate } from 'class-validator';
import { UniqueKeyError } from '../errors';

export default abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn() readonly id: number;

  @CreateDateColumn() readonly createdAt: Date;

  @UpdateDateColumn() readonly updatedAt: Date;

  async validate() {
    const errors = await validate(this, { validationError: { target: false } });
    if (errors.length > 0) {
      let formattedErrors = {};
      errors.forEach(error => {
        formattedErrors[error.property] = Object.keys(error.constraints).map(
          key =>
            error.constraints[key][0].toUpperCase() +
            error.constraints[key].substr(1)
        );
      });
      return formattedErrors;
    }
    return null;
  }

  async save() {
    try {
      return await super.save();
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const property = (<string>(<any>err).constraint).replace(
          `uk_${(<any>err).table}_`,
          ''
        );
        throw new UniqueKeyError({
          data: {
            [property]: [
              property[0].toUpperCase() +
                property.substr(1) +
                ' is already taken'
            ]
          }
        });
      }
      throw err;
    }
  }
}
