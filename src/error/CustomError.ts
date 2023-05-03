import { ErrorTypeType } from '../type/error';
import { ErrorTypes } from './Errors';

export class CustomError extends Error {
  code: number;

  constructor(errorTypeType: ErrorTypeType) {
    const { message, code } = ErrorTypes[errorTypeType];
    super(message);
    this.code = code;
  }
}
