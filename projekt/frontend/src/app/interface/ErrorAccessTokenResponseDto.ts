export interface ErrorAccessTokenResponseDto {
    readonly code: string;
    readonly message: string;
    readonly timestamp: string;
    readonly errors: FieldValidationErrorsDto[];
};

export interface FieldValidationErrorsDto {
    readonly code: string;
    readonly field: string;
    readonly message: string;
};