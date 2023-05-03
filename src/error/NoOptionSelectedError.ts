import { ErrorTypeTypes } from '../type/error';
import { CustomError } from './CustomError';

export class NoOptionSelectedError extends CustomError {
  constructor() {
    super(ErrorTypeTypes.NO_OPTION_SELECTED);
  }
}
