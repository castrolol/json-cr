const Referencer = require('./referencer');

module.exports = function serialize(object, replacements, idents) {
    var referencer = new Referencer(object);
    var referencedObject = referencer.preserveReferences();
   
    return JSON.stringify(object, replacements, idents);

}