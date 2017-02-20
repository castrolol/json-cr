 

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