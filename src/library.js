/**
 * This class handles adding libraries to the test suit.
 * E.g. adding `lodash` to the `vendor` folder
 * TODOs:
 *  * separate `make folder` with `copy file`
 */

/**
 * create vendor folder and copy vendor file content
 * @param {String} folder destination folder
 */
var add = function(folder) {
    var wrench = require('wrench'),
        path = require('path'),
        fs = require('fs'),
        lodash; // file to move to `vendor` folder

    // make vendor folder
    wrench.mkdirSyncRecursive(path.join(folder, 'vendor'));

    // read from node nodule and write to `vendor` forlder
    lodash = fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'lodash', 'index.js'), 'utf8');
    fs.writeFileSync(path.join(folder, 'vendor', 'lodash.js'), lodash);
};

module.exports = {
    add: add
};
