const {
    getWithFilter,
    deleteOne,
    updateOne,
    createOne,
    getOne

} = require('../handlerFactory');

const ServicesCategories  = require("../../models/ServiceCategories");

exports.getServiceCategories = getWithFilter(ServicesCategories);

exports.getOneServiceCategories = getOne(ServicesCategories);

exports.updateServiceCategories = updateOne(ServicesCategories);

exports.deleteServiceCategories = deleteOne(ServicesCategories);

exports.createServiceCategories = createOne(ServicesCategories);
