export interface ErrorAccessTokenResponseDto {
    code: string;
    message: string;
    timestamp: string;
    errors: FieldValidationErrorsDto[];
};

export interface FieldValidationErrorsDto {
    code: string;
    field: string;
    message: string;
};