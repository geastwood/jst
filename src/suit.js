/**
 * This class represents a single suit
 */
var _ = require('lodash');
var path = require('path');

module.exports = {

    /**
     * @param name
     * @returns {*|Rx.IPromise<R>}
     */
    create: function(def) {
        // mixins
        // TODO, handle array syntax
        return _.assign(def, {
            getPath: function() {
                return this[0].path;
            },
            getTags: function() {
                return this[0].tag.join(', ');
            },
            getDescriptionPath: function() {
                return path.join(this.getPath(), 'description.txt');
            }
        });
    }
};
