const AppError = require("../../appError"); 

class HttpClientInterface {
  async request(url, method, params, headers) {
    throw new AppError("Method 'request' must be implemented.", 500);
  }
}

module.exports = HttpClientInterface;