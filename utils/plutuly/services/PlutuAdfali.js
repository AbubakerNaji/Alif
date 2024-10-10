const PlutuService = require("./PlutuService");
const PlutuApiResponse = require("./responses/PlutuApiResponse");
const PlutuAdfaliApiResponse = require("./responses/PlutuAdfaliApiResponse");
const AppError = require("../../appError"); 

class PlutuAdfali extends PlutuService {
  constructor() {
    super();
    this.gateway = "edfali";
  }

  async verify(mobileNumber, amount) {
    if (!mobileNumber || !amount) throw new AppError("Invalid parameters", 400);
    const params = { mobile_number: mobileNumber, amount };
    
    const responseData = await this.callApi(params, "verify", this.gateway);
    const plutuApiResponse = new PlutuApiResponse(responseData);
    return new PlutuAdfaliApiResponse(plutuApiResponse);
  }

  async confirm(processId, code, amount, invoiceNo) {
    const params = {
      process_id: processId,
      code,
      amount,
      invoice_no: invoiceNo,
    };
    
    const responseData = await this.callApi(params, "confirm", this.gateway);
    const plutuApiResponse = new PlutuApiResponse(responseData);
    return new PlutuAdfaliApiResponse(plutuApiResponse);
  }
}

module.exports = PlutuAdfali;
