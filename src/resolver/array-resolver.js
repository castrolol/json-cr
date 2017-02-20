 
module.exports = function arrayResolver(src, instances, chooseResolver) {


    var result = [];

    for (var index = 0; index < src.length; index++) {

        var resolver = chooseResolver(src[index]);

        result[index] = resolver(src[index], instances, chooseResolver, src, index);

    }

    return result;

}