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