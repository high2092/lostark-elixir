import { ErrorType, ErrorTypeType, ErrorTypeTypes } from '../type/error';

type ErrorTypeEnum = {
  [key in ErrorTypeType]: ErrorType;
};

export const ErrorTypes: ErrorTypeEnum = {
  [ErrorTypeTypes.NO_OPTION_SELECTED]: {
    message: '옵션을 선택해주세요.',
    code: 2001,
  },
};
