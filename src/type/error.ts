export interface ErrorType {
  message: string;
  code: number;
}

export const ErrorTypeTypes = {
  NO_OPTION_SELECTED: 'noOptionSelected',
} as const;

export type ErrorTypeType = (typeof ErrorTypeTypes)[keyof typeof ErrorTypeTypes];
