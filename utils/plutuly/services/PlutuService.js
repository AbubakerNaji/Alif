const HttpClient = require("../http/HttpClient");
const AppError = require("../../appError");
const { config } = require("../config/plutu");
const crypto = require("crypto");
const PlutuApiResponse = require("./responses/PlutuApiResponse");

class PlutuService {
  constructor(httpClient = new HttpClient()) {
    this.httpClient = httpClient;
    this.apiKey = config.apiKey;
    this.accessToken = config.accessToken;
    this.secretKey = config.secretKey;
    this.baseUrl = config.baseUrl;
    this.apiVersion = config.apiVersion;
  }

  getApiHeaders() {
    return {
      // Accept: "application/json",
      "X-API-KEY": `${this.apiKey}`,
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  getApiUrl(action, gateway) {
    return `${this.baseUrl}/${this.apiVersion}/transaction/${gateway}/${action}`;
  }

  async callApi(params, action, gateway) {
    const url = await this.getApiUrl(action, gateway);
    const headers = await this.getApiHeaders();
    const method ="POST";

    
    try {
  //      console.log(headers);
     //  console.log(params);

      const apiResponse = await this.httpClient.request(
        url,
        method,
        params,
        headers,
      );
      return new PlutuApiResponse(apiResponse);
    } catch (error) {
   // console.log(error);
      throw new AppError("API call failed", 500);
    }
  }

  getCallbackParameters(parameters, callbackParameters) {
    return Object.keys(parameters)
      .filter((key) => callbackParameters.includes(key))
      .map((key) => `${key}=${parameters[key]}`)
      .join("&");
  }

  checkValidCallbackHash(parameters, data) {
    const receivedHash = parameters["hashed"];
    const generatedHash = crypto
      .createHmac("sha256", this.secretKey)
      .update(data)
      .digest("hex")
      .toUpperCase();

    if (
      !receivedHash ||
      !crypto.timingSafeEqual(
        Buffer.from(receivedHash),
        Buffer.from(generatedHash)
      )
    ) {
      throw new AppError("Invalid callback hash", 400);
    }
  }

  validateMobileNumber(mobileNumber) {
    const regex = /^09[1-6][0-9]{7}$/;
    return regex.test(mobileNumber);
  }

  validateSadadMobileNumber(mobileNumber) {
    const regex = /^09[13][0-9]{7}$/;
    return regex.test(mobileNumber);
  }

  validateBirthYear(birthYear) {
    const currentYear = new Date().getFullYear();
    return (
      typeof birthYear === "number" &&
      birthYear >= 1940 &&
      birthYear <= currentYear - 12
    );
  }

  validateAmount(amount) {
    return typeof amount === "number" && amount > 0;
  }

  validateProcessId(processId) {
    return /^\d+$/.test(processId);
  }

  validateCode(code) {
    return /^\d{4}$/.test(code); // For PlutuAdfali
  }

  validateSadadCode(code) {
    return /^\d{6}$/.test(code); // For PlutuSadad
  }

  validateInvoiceNo(invoiceNo) {
    const regex = /^[A-Za-z0-9.\-_]+$/;
    return regex.test(invoiceNo) && invoiceNo.trim() !== "";
  }

  validateCallbackUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  validateReturnUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = PlutuService;
