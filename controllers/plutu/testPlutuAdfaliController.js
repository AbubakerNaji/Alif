const HttpClient = require("../../utils/plutuly/http/HttpClient");
const plutuAdfali = require("../../utils/plutuly/services/PlutuAdfali");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

const PlutuAdfali = new plutuAdfali();

exports.testPlutuAdfaliVerify = catchAsync(async (req, res, next) => {
  const { mobileNumber, amount, invoiceNo } = req.body; // invoiceNo is now part of the request body

  const verifyResponse = await PlutuAdfali.verify(mobileNumber, amount);

  if (verifyResponse.getOriginalResponse().isSuccessful()) {
    res.status(200).json({
      status: "success",
      message: "Sent the request to verify the payment",
      data: {
        data: verifyResponse.getOriginalResponse(),
        invoiceNo
      },
    });
  }
  if (verifyResponse.getOriginalResponse().hasError()) {
    return next(
      new AppError(
        `${verifyResponse
          .getOriginalResponse()
          .getErrorCode()} : ${verifyResponse
          .getOriginalResponse()
          .getErrorMessage()}`,
        400
      )
    );
  }
});



exports.testPlutuAdfaliConfirm = catchAsync(async (req, res, next) => {
  const mobileNumber = req.body.mobileNumber;
  const amount = req.body.amount;
  const code = req.body.code;
  const invoiceNo = req.body.invoiceNo;
  const processId = req.body.processId;

  const confirmResponse = await PlutuAdfali.confirm(
    processId,
    code,
    amount,
    invoiceNo
  );
  if (confirmResponse.getOriginalResponse().isSuccessful()) {
    req.body.transaction = confirmResponse.getTransactionId();
    req.body.plutu = confirmResponse.getOriginalResponse();
    next();
    // res.status(200).json({
    //   status: "success",
    //   message: "payment confirmed successfully",
    //   data: {
    //     data: confirmResponse.getOriginalResponse(),
    //   },
    // });
  } else if (confirmResponse.getOriginalResponse().hasError()) {
    return next(
      new AppError(
        `${confirmResponse
          .getOriginalResponse()
          .getErrorCode()} : ${confirmResponse
          .getOriginalResponse()
          .getErrorMessage()}`,
        400
      )
    );
  } else {
    return next(new AppError("No response from plutuly", 400));
  }
});

async function testPlutuAdfali() {
  const mobileNumber = "0913632323";
  const amount = 10;
  const code = "1111";
  const invoiceNo = "1234";

  try {
    // Step 1: Verify Payment
    const verifyResponse = await PlutuAdfali.verify(mobileNumber, amount);

    if (verifyResponse.getOriginalResponse().isSuccessful()) {
      const processId = verifyResponse.getProcessId();
      console.log(`Process ID: ${processId}`);

      // Step 2: Confirm Payment
      const confirmResponse = await PlutuAdfali.confirm(
        processId,
        code,
        amount,
        invoiceNo
      );

      if (confirmResponse.getOriginalResponse().isSuccessful()) {
        console.log("Payment confirmed successfully");
      } else if (confirmResponse.getOriginalResponse().hasError()) {
        const errorCode = confirmResponse.getOriginalResponse().getErrorCode();
        const errorMessage = confirmResponse
          .getOriginalResponse()
          .getErrorMessage();
        console.error(`Error: ${errorCode} - ${errorMessage}`);
      }
    } else if (verifyResponse.getOriginalResponse().hasError()) {
      const errorCode = verifyResponse.getOriginalResponse().getErrorCode();
      const errorMessage = verifyResponse
        .getOriginalResponse()
        .getErrorMessage();
      console.error(`Verify Error ${errorCode}: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
}

const wrappedTestPlutuAdfali = catchAsync(testPlutuAdfali);

//module.exports = wrappedTestPlutuAdfali;
exports.Adfali = wrappedTestPlutuAdfali;
