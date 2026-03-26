export function extractErrorMessage(error: any): string {
  // ✅ Case 1: Backend returned a custom message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // ✅ Case 2: Backend validation errors (field errors)
  if (error?.response?.data?.errors) {
    return error.response.data.errors
      .map((err: any) => `${err.field}: ${err.message}`)
      .join(', ');
  }

  // ✅ Case 3: Network / Axios / JS error
  if (error?.message) {
    return error.message;
  }

  // ✅ Fallback
  return 'Something went wrong';
}