var src = require('../check');
module.exports.api = function(test) {
    test.ok(src.capitalize, 'function `capitalize` should be defined');
    test.done();
};
module.exports.capitalize = function(test) {
    test.deepEqual('Google', src.capitalize('google'), 'Google');
    test.done();
};
