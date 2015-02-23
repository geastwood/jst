var Q = require('q');
var fs = require('fs');
var path = require('path');

module.exports = {
    fileExistPromise: function(basePath, filePath) {
        var fullpath = path.resolve(basePath, filePath),
            defer = Q.defer();

        fs.exists(fullpath, function(exist) {
            if (exist) {
                defer.resolve(fullpath);
            } else {
                defer.resolve(false);
            }
        });

        return defer.promise;
    }
};
