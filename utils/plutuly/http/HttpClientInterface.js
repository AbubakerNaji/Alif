class HttpClientInterface {
    request(url, method, params = {}, headers = {}) {
      throw new Error("Method 'request' must be implemented.");
    }
  }
  
  module.exports = HttpClientInterface;
  