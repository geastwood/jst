var Q = require('q');
var _ = require('lodash');

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
    getSuitNames: getSuitNames,
    getDefByName: function(name) {
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
    },
    /**
     * @param name
     * @returns {*|Rx.IPromise<R>}
     */
    getDefinition: function(name) {
        return this.getDefByName(name).then(function(def) {

            // mixins
            return _.assign(def, {
                getPath: function() {
                    return this[0].path;
                },
                getTags: function() {
                    return this[0].tag.join(', ');
                }
            });
        }).catch(function(err) {
            throw new Error(err);
        });
    }
};
