var api = require('../check');
module.exports = {
    api: function(test) {
        test.ok(api.unsplat, 'unsplat function should exist.');
        test.done();
    },
    case1: function(test) {
        var sourceFn = function(a, b) {
            return a * b;
        };
        var targetFn = api.unsplat(sourceFn);
        test.equal(targetFn([5, 6]), 30, 'unsplat function should work');
        test.done();
    }
};
