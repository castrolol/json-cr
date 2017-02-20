const Resolver = require('./resolver');

module.exports = function parse(json, conversor) {
    var object = JSON.parse(json, conversor);
    var resolver = new Resolver(object);
  
    return resolver.resolve();

}