import { logger } from "@/config/logger";
import type { Elysia } from "elysia";

export class HttpError extends Error {
  public constructor(
    public message: string,
    public statusCode: number,
    public traceCode: string,
    public errorData: Record<string, unknown> = {},
    public errorParams: Record<string, unknown> = {}
  ) {
    super(message);
  }

  public static BadRequest(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Bad Request",
      400,
      traceCode ?? "BAD_REQUEST_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static Unauthorized(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Unauthorized",
      401,
      traceCode ?? "UNAUTHORIZED_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static PaymentRequired(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Payment Required",
      402,
      traceCode ?? "PAYMENT_REQUIRED_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static Forbidden(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Forbidden",
      403,
      traceCode ?? "FORBIDDEN_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static NotFound(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Not Found",
      404,
      traceCode ?? "NOT_FOUND_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static MethodNotAllowed(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Method Not Allowed",
      405,
      traceCode ?? "METHOD_NOT_ALLOWED_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static Conflict(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Conflict",
      409,
      traceCode ?? "CONFLICT_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static UnsupportedMediaType(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "UnsupportedMediaType",
      415,
      traceCode ?? "UNSUPPORTED_MEDIA_TYPE_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static IAmATeapot(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "IAmATeapot",
      418,
      traceCode ?? "I_AM_TEAPOT_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static TooManyRequests(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Too Many Requests",
      429,
      traceCode ?? "TOO_MANY_REQUESTS_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static Internal(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Internal Server Error",
      500,
      traceCode ?? "INTERNAL_SERVER_ERROR_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static NotImplemented(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Not Implemented",
      501,
      traceCode ?? "NOT_IMPLEMENTED_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static BadGateway(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Bad Gateway",
      502,
      traceCode ?? "BAD_GATEWAY_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static ServiceUnavailable(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Service Unavailable",
      503,
      traceCode ?? "SERVICE_UNAVAILABLE_UNKNOWN",
      errorData,
      errorParams
    );
  }

  public static GatewayTimeout(
    message?: string,
    traceCode?: string,
    errorData?: Record<string, unknown>,
    errorParams?: Record<string, unknown>
  ): HttpError {
    return new HttpError(
      message || "Gateway Timeout",
      504,
      traceCode ?? "GATEWAY_TIMEOUT_UNKNOWN",
      errorData,
      errorParams
    );
  }
}

export const httpError = () => (app: Elysia<"", false>) =>
  app
    .error({ ELYSIA_HTTP_ERROR: HttpError })
    .onError(async ({ code, error, set }) => {
      code === "VALIDATION"
        ? logger.error(error, "VALIDATION")
        : logger.error(error, "ERROR");
      switch (code) {
        case "ELYSIA_HTTP_ERROR": {
          set.status = error.statusCode;
          return {
            code: error.traceCode,
            message: {
              error: error.message,
              stack: error.errorParams,
            },
            data: error.errorData,
          };
        }
        case "VALIDATION": {
          set.status = 400;
          return {
            code: "VALIDATION",
            message: "error.validation_failed",
            data: error.all.map((x) => {
              if (x.summary) {
                return {
                  path: x.path,
                  message: x.message,
                  value: x.value,
                };
              }
            }),
          };
        }
        case "INTERNAL_SERVER_ERROR": {
          set.status = 500;
          return {
            code: "INTERNAL_SERVER_ERROR",
            message: "error.internal_server_error",
            data: null,
          };
        }
        case "INVALID_COOKIE_SIGNATURE": {
          set.status = 401;
          return {
            code: "INVALID_COOKIE_SIGNATURE",
            message: "error.invalid_cookie_signature",
            data: null,
          };
        }
        case "PARSE": {
          set.status = 500;
          return {
            code: "PARSE",
            message: "error.parse",
            data: null,
          };
        }
        case "UNKNOWN": {
          set.status = 500;
          return {
            code: "UNKNOWN",
            message: "error.unknown",
            data: null,
          };
        }
        case "NOT_FOUND": {
          set.status = 404;
          return {
            code: "NOT_FOUND",
            message: "error.not_found",
            data: null,
          };
        }
      }
    });
