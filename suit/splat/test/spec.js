var api = require('../check');
module.exports = {
    api: function(test) {
        test.ok(api.splat, 'splat function should be exported');
        test.done();
    },
    'convert Function 1': function(test) {
        var sourceFn = function(arr) {
            return arr.reduce(function(prev, curr) {
                return prev + curr;
            }, 0);
        };
        var targetFn = api.splat(sourceFn);
        test.equal(sourceFn([1, 3, 4]), 8, 'cell check')
        test.equal(targetFn(1, 3, 4), 8, 'should work.');
        test.done();
    }
};
