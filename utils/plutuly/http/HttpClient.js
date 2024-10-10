const axios = require("axios");
const catchAsync = require("../../catchAsync"); 
const AppError = require("../../appError"); 


class HttpClient {
  async request(url, method, params, headers) {
    try {
   //  console.log(headers);
    // console.log(url);

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
       // console.log(apiError);
        throw new AppError(apiError.message || "An unknown error occurred", error.response.status);
      } else if (error.request) {
        throw new AppError("No response received from the server", 500);
      } else {
        throw new AppError(error.message || "Error setting up the request", 500);
      }
    }
  }
}


module.exports = HttpClient;
