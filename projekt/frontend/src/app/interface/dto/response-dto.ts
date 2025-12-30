export interface FieldValidationErrorDto {
  code: ErrorCode;
  field: string;
  message: string;
}

export type SuccessCode = string;

export interface ErrorCode {
    name: string;
    httpStatus: number;
    message: string;
};

export default interface ResponseDto<T> {
  code: SuccessCode;
  message: string;
  timestamp: string;
  error?: FieldValidationErrorDto[] | null;
  data: T;
}
