import { AxiosError } from "axios";

function isAxiosError(error: unknown): error is AxiosError<{ error: string }> {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

export function getAxiosErrorMessage(error: unknown): string {
  // Handle Axios errors
  if (isAxiosError(error)) {
    return error.response?.data?.error || error.message || "Request failed";
  }

  // Handle regular JS errors
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return "An unexpected error occurred";
}
