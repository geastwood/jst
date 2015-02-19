var api = require('../check');
module.exports = {
    api: function(test) {
        test.ok(api.contrary, 'contrary function should exist');
        test.done();
    },
    'predicate: bigger than 5': function(test) {
        var predicate = function(num) {
            return num > 5;
        };
        var contrary = api.contrary(predicate);
        test.equal(contrary(10), false, 'predicate function return true if any number bigger than 5' +
        ', function returned by contrary function should return "false" when input is 10');
        test.done();
    },
    'Predicate: isNotArray': function(test) {
        var isArray = function(input) {
            return Object.prototype.toString.call(input) === '[object Array]';
        };
        var isNotArray = api.contrary(isArray);
        test.equal(isNotArray({}), true, 'Object literal "{}" is not array');
        test.equal(isNotArray(''), true, 'Empty String is not array');
        test.equal(isNotArray(function() {}), true, 'Function is not array');
        test.equal(isNotArray(/test/), true, 'RegExp is not array');
        test.done();
    }
};
