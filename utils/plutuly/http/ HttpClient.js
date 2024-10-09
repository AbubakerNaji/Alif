const axios = require("axios");

class HttpClient {
  async request(url, method, params = {}, headers = {}) {
    try {
      const response = await axios({
        method,
        url,
        headers,
        data: params,
        timeout: 60000,
      });
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (error.response) {
        const apiError = error.response.data?.error || {};
        return {
          success: false,
          status: error.response.status,
          data: error.response.data,
          error: {
            code: apiError.code || "UNKNOWN_ERROR",
            message: apiError.message || "An unknown error occurred",
          },
        };
      } else if (error.request) {
        // No response received from the server
        return {
          success: false,
          status: 500,
          data: null,
          error: {
            code: "NO_RESPONSE",
            message: "No response received from the server",
          },
        };
      } else {
        // Error setting up the request
        return {
          success: false,
          status: 500,
          data: null,
          error: {
            code: "REQUEST_SETUP_ERROR",
            message: error.message || "Error setting up the request",
          },
        };
      }
    }
  }
}

module.exports = HttpClient;
