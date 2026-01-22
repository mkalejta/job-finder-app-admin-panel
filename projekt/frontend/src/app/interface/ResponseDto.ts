export interface FieldValidationErrorDto {
  readonly code: ErrorCode;
  readonly field: string;
  readonly message: string;
};

export type SuccessCode = string;

export interface ErrorCode {
    readonly name: string;
    readonly httpStatus: number;
    readonly message: string;
};

export interface ResponseDto<T> {
  readonly code: SuccessCode;
  readonly message: string;
  readonly timestamp: string;
  readonly error?: FieldValidationErrorDto[] | null;
  readonly data: T;
};
