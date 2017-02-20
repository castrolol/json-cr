 
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