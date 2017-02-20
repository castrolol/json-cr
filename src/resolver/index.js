const chooseResolver = require('./resolver-factory');
const extractReferences = require('./extract-references');

function Resolver(object){
    this.source = object;
    this.instances = [];
    var _listeners = {};
    this.instances.on = (event, listener) => {
        _listeners[event] = _listeners[event] || [];
        _listeners[event].push(listener);
    }
    this.instances.emit = (event, value) => {
        _listeners[event] = _listeners[event] || [];
        _listeners[event].forEach( action => action(value));        
    }

}




Resolver.prototype.resolve = function(){

    var resolve = chooseResolver(this.source);
    
    extractReferences(this.source, this.instances);

    return resolve(this.source, this.instances, chooseResolver);

}


module.exports = Resolver;