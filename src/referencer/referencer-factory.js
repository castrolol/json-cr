const objectReferencer = require('./object-referencer');
const arrayReferencer = require('./array-referencer');
const commonReferencer = require('./common-referencer');

module.exports = function chooseReferencer(value) {

    var type = typeof value;

    if (type == "object" && type != null) {
        if (value instanceof Array) return arrayReferencer;
        return objectReferencer;
    }

    return commonReferencer;

}