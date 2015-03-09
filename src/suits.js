/**
 * This class represents suits structure
 */
var Q = require('q');
var fs = require('fs');
var path = require('path');

var getDefinition = function() {
    return require('../suit/suits.json');
};
var getSuits = function() {
    return getDefinition().suits;
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
    getByName: getByName,
    exists: function(suit) {
        return getSuits().some(function(def) {
            return def.name === suit.name;
        });
    },
    add: function(def) {
        var defer = Q.defer();
        var definition = getDefinition();

        if (this.exists(def)) {
            defer.reject(def.name + ' exists already.');
        } else {
            definition.suits.push(def);
            fs.writeFile(path.join(__dirname, '../suit/suits.json'), JSON.stringify(definition, null, 4), function(err) {
                if (err) {
                    defer.reject(err)
                }
                defer.resolve('done');
            });
        }

        return defer.promise;
    }
};
