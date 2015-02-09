var Q = require('q');
var fs = require('fs');

var definition = require('../suit/suits.json');

var getSuits = function() {
    return definition.suits;
};

var getSuitNames = function() {
    return getSuits().map(function(suit) {
        return suit.name;
    });
};

module.exports = {
    getSuitNames: getSuitNames
};
