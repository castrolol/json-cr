(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require("./src/index");
},{"./src/index":2}],2:[function(require,module,exports){
const parse = require('./parser');
const serializer = require('./serializer');

const JSONCR = {};

JSONCR.parse = (json, conversor) => parse(json, conversor);
JSONCR.stringify = (object, replacements, idents) => serializer(object, replacements, idents);


if(window){
    window.JSONCR = JSONCR;
}

module.exports = JSONCR;
},{"./parser":3,"./serializer":15}],3:[function(require,module,exports){
const Resolver = require('./resolver');

module.exports = function parse(json, conversor) {
    var object = JSON.parse(json, conversor);
    var resolver = new Resolver(object);
  
    return resolver.resolve();

}
},{"./resolver":12}],4:[function(require,module,exports){
 
module.exports = function arrayReferencer(src, instances, chooseReferencer) {


    for (var index = 0; index < src.length; index++) {


        var referencer = chooseReferencer(src[index]);

        src[index] = referencer(src[index], instances, chooseReferencer);

    }

    return src;

}
},{}],5:[function(require,module,exports){
module.exports = function commonReferencer(value){
    return value;
}
},{}],6:[function(require,module,exports){
const chooseReferencer = require('./referencer-factory');

function Referencer(object) {
    this.source = object;
    this.instances = [];
}


Referencer.prototype.preserveReferences = function () {

    var referencer = chooseReferencer(this.source);
    extractReferences(this.source, this.instances);
    return referencer(this.source, this.instances, chooseReferencer);

}

module.exports = Referencer;
},{"./referencer-factory":8}],7:[function(require,module,exports){
 
module.exports = function objectReferencer(src, instances, chooseReferencer) {



    if ("$id" in src) {
        return { $ref: src.$id };
    }

    src.$id = instances.push(src).toString();

    for(var prop in src){

        if(prop == "$id") continue;

        var referencer = chooseReferencer(src[prop]);

        src[prop] = referencer(src[prop], instances, chooseReferencer);

    }

    return src;

}
},{}],8:[function(require,module,exports){
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
},{"./array-referencer":4,"./common-referencer":5,"./object-referencer":7}],9:[function(require,module,exports){
 
module.exports = function arrayResolver(src, instances, chooseResolver) {


    var result = [];

    for (var index = 0; index < src.length; index++) {

        var resolver = chooseResolver(src[index]);

        result[index] = resolver(src[index], instances, chooseResolver, src, index);

    }

    return result;

}
},{}],10:[function(require,module,exports){
module.exports = function commomResolver(src){
    return src;
}
},{}],11:[function(require,module,exports){
module.exports = function extractReferences(source, instances){

    var type = typeof source;
    

    switch(type){
        case "object":
            if(source instanceof Array){
                for(var i = 0; i < source.length; i++){
                    source[i] = extractReferences(source[i], instances);
                }
            }else{
                if("$id" in source) instances[source.$id] = { source: source, value: {} };
                for(var prop in source){
                    source[prop] = extractReferences(source[prop], instances);
                }
            }


        default:
            return source;

    }


}
},{}],12:[function(require,module,exports){
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
},{"./extract-references":11,"./resolver-factory":14}],13:[function(require,module,exports){
 

module.exports = function objectResolver(src, instances, chooseResolver, parent, prop) {

    if (!src) return src;

    var keys = Object.keys(src);
    if (keys.length == 1 && keys[0] == "$ref") {
        return instances[src.$ref].value;

    }

    var result = {};
    if("$id" in src) result = instances[src.$id].value;

    for (var prop in src) {

        if(prop == "$id") continue;

        var resolver = chooseResolver(src[prop]);

        result[prop] = resolver(src[prop], instances, chooseResolver, src, prop);

    }

    return result;

}
},{}],14:[function(require,module,exports){
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
},{"./array-resolver":9,"./common-resolver":10,"./object-resolver":13}],15:[function(require,module,exports){
const Referencer = require('./referencer');

module.exports = function serialize(object, replacements, idents) {
    var referencer = new Referencer(object);
    var referencedObject = referencer.preserveReferences();
   
    return JSON.stringify(object, replacements, idents);

}
},{"./referencer":6}]},{},[1]);
