/**
 * This class represents suits structure
 */
var Q = require('q');
var definition = require('../suit/suits.json');

var getSuits = function() {
    return definition.suits;
};

var getSuitNames = function() {
    return getSuits().map(function(suit) {
        return suit.name;
    });
};

var getByName = function(name) {
    var defer = Q.defer(), rst;

    rst = getSuits().filter(function(suit) {
        return suit.name === name;
    });

    if (rst.length) {
        defer.resolve(rst);
    } else {
        defer.reject('No suit with name "' + name + '" is found.');
    }

    return defer.promise;
};

module.exports = {
    getSuitNames: getSuitNames,
    getSuits: getSuits,
    getByName: getByName
};
