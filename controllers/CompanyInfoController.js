const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
    getWithFilter,
    deleteOne,
    updateOne,
    createOne,
    getOne

} = require('./handlerFactory');
const CompanyInfo = require("../models/CompanyInfo");

exports.createCompanyInfo = createOne(CompanyInfo); 
exports.updateCompanyInfo = updateOne(CompanyInfo);
exports.deleteCompanyInfo = deleteOne(CompanyInfo);
exports.selectCompanyInfo = getWithFilter(CompanyInfo);



