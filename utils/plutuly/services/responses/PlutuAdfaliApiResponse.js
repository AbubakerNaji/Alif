const PlutuApiResponse = require("./PlutuApiResponse");

class PlutuAdfaliApiResponse {
  constructor(plutuApiResponse) {
    this.plutuApiResponse = plutuApiResponse;
  }

  getOriginalResponse() {
    return this.plutuApiResponse;
  }

  getProcessId() {
    return this.plutuApiResponse.getResultValue("process_id")?.toString() || null;
  }

  getTransactionId() {
    return this.plutuApiResponse.getResultValue("transaction_id") || null;
  }
}

module.exports = PlutuAdfaliApiResponse;
