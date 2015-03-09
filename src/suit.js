/**
 * This class represents a single suit
 */
var _ = require('lodash');
var nsPath = require('path');
var fs = require('fs');
var Q = require('q');

module.exports = {

    /**
     * @param name
     * @returns {*|Rx.IPromise<R>}
     */
    tap: function(def) {
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
    },
    create: function(path, suit) {
        // create suit and test folder
        var suitPath = nsPath.join(path, suit.name),
            testFolderPath = nsPath.join(suitPath, 'test'),
            defer = Q.defer(),
            entry = {};

        try {
            fs.mkdirSync(suitPath);
            fs.mkdirSync(testFolderPath);

            // create files
            fs.writeFileSync(nsPath.join(suitPath, 'src.js'), '// Please put your source js content here.\n');
            fs.writeFileSync(nsPath.join(testFolderPath, 'spec.js'), 'var src = require(\'./check\');\n' );

            entry.name = suit.name;
            entry.description = suit.description;
            entry.path = suit.name;

            defer.resolve(entry);

        } catch (e) {
            defer.reject(e);
        }

        return defer.promise;
    },
    validate: function() {

    }
};
