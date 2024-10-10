const AppError = require("../../../appError");

class PlutuApiResponse {

  constructor(apiResponse) {
    this.success = apiResponse.success;
    this.status = apiResponse.status;
    this.data = apiResponse.data;
    this.error = apiResponse.error;
  }

  isSuccessful() {
    return this.success;
  }

  getStatusCode() {
    return this.status;
  }

  getBody() {
    return this.data;
  }

  getResult() {
    return this.data?.result || {};
  }

  getResultValue(key = null) {
    if (key === null) {
      return this.getResult();
    } else {
      return this.getResult()[key] || null;
    }
  }

  hasError() {
    return !this.success;
  }

  getErrorCode() {
    return this.error?.code || "UNKNOWN_ERROR";
  }

  getErrorMessage() {
    return this.error?.message || "An unknown error occurred";
  }

  getErrorFields() {
    return this.data?.error?.fields || null;
  }
}

module.exports = PlutuApiResponse;
