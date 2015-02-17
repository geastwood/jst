module.exports = {
    capitalize: function(str) {
        return _.first(str).toUpperCase() + str.slice(1);
    }
};
