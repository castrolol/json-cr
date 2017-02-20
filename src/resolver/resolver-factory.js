const objectResolver  = require('./object-resolver');
const arrayResolver = require( './array-resolver');
const commonResolver  = require('./common-resolver');

module.exports = function chooseResolver(value){

    var type = typeof value;

    if(type == "object" && type != null){
        if(value instanceof Array) return arrayResolver;
        return objectResolver;
    }

    return commonResolver;

}