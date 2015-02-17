module.exports = {
    unsplat: function(fn) {
        return function(arr) {
            return fn.apply(null, arr);
        };
    }
};
