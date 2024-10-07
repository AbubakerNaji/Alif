const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Pass = require("../models/Pass");
const {
  deleteOneAuth,
  getWithFilterAuth,
  updateOneAuth,
  createOneAuth,
} = require("./handlerFactoryLogin");

exports.getPasses = getWithFilterAuth(Pass, ["kid", "service", "serviceDate"]);

exports.AddPass = createOneAuth(Pass);
exports.updatePass = catchAsync(async (req, res, next) => {
  const { payedAmount, isActive, isCancelled } = req.body;

  const updatedPass = await Pass.findByIdAndUpdate(
    req.params.id,
    { payedAmount, isActive, isCancelled },
    { new: true, runValidators: true }
  );

  if (!updatedPass) {
    return next(new AppError("No pass found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Entity was patched successfully",
    data: {
      data: updatedPass,
    },
  });
});
exports.deletePass = deleteOneAuth(Pass, ["user"]);
