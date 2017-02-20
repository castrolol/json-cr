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