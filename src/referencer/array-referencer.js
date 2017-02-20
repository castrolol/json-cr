 
module.exports = function arrayReferencer(src, instances, chooseReferencer) {


    for (var index = 0; index < src.length; index++) {


        var referencer = chooseReferencer(src[index]);

        src[index] = referencer(src[index], instances, chooseReferencer);

    }

    return src;

}