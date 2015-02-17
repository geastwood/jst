module.exports = {
    splat: function(fn) {
        return function() {
            return fn.call(null, [].slice.call(arguments));
        }
    }
};
