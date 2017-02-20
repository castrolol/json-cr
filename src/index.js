const parse = require('./parser');
const serializer = require('./serializer');

const JSONCR = {};

JSONCR.parse = (json, conversor) => parse(json, conversor);
JSONCR.stringify = (object, replacements, idents) => serializer(object, replacements, idents);


if(window){
    window.JSONCR = JSONCR;
}

module.exports = JSONCR;