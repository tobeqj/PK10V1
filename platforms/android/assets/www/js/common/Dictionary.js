var Dictionary = function() {
    this.datastore = {};
};
Dictionary.prototype.add = function(key, value) {
    this.datastore[key] = value;
};
Dictionary.prototype.find = function(key) {
    return this.datastore[key];
};
Dictionary.prototype.remove = function(key) {
    delete thisPage.datastore[key];
};
Dictionary.prototype.getKeys = function() {
    return Object.keys(this.datastore);
};
Dictionary.prototype.getValues = function() {
    var keys = this.getKeys();
    var values = [];
    for (var i = 0 ; i < keys.length; i++) {
        values.push(this.datastore[keys[i]]);
    }
    return values;
};

