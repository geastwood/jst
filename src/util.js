var Q = require('q');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

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
    },
    print: function(content, prompt) {
        prompt = prompt || 'info';

        var map = {
            info: chalk.blue('INFO:'),
            error: chalk.red('Error:')
        };

        // special format
        content.split('\n').map(function(line) {
            console.log(map[prompt], line);
        });
    }
};
