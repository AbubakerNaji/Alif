const ServicesType  = require("../../models/ServicesType");
const {
    getWithFilter,
    deleteOne,
    updateOne,
    createOne,
    getOne

} = require('../handlerFactory');

exports.createServiceType = createOne(ServicesType);



exports.getServiceType = getWithFilter(ServicesType);

exports.getOneServiceType = getOne(ServicesType);

exports.updateServiceType = updateOne(ServicesType);

exports.deleteServiceType = deleteOne(ServicesType);




