package example.libraries.exception;

public record ApiErrorResponse(int status, String code, String message) {
}