#!/usr/bin/env node

var SuitManager = require('./src/suitManager');
var program = require('commander');
var _ = require('lodash');
var util = require('./src/util');
var library = require('./src/library');

var runSuit = function(filepath, suit) {
    var fs = require('fs'),
        tmp = require('os').tmpDir(),
        tmpFolder = String(Date.now()),
        path = require('path'),
        wrench = require('wrench'),
        targetPath = path.join(tmp, tmpFolder),
        content;

    content = fs.readFileSync(filepath, 'utf8');

    content = 'var _ = require(\'./vendor/lodash\');' + '\n' + content;
    wrench.copyDirSyncRecursive(path.join(__dirname, 'suit', suit.getPath()), targetPath);
    fs.writeFileSync(path.join(targetPath, 'check.js'), content);

    library.add(targetPath);

    require('child_process').exec('nodeunit ' + path.join(targetPath, 'test'), function(stdin, stdout) {
        console.log(stdout);
        wrench.rmdirSyncRecursive(targetPath);
    });
};

var describeSuit = function(suit) {
    var fs = require('fs'),
        path = require('path'),
        filePath = path.join(__dirname, 'suit', suit.getDescriptionPath()),
        fileExistPromise = _.partial(util.fileExistPromise, '.');

    fileExistPromise(filePath).then(function(path) {
        if (path === false) {
            console.log('No description for this test suit');
        } else {
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(data);
            });
        }
    });
};

program.command('check <file>')
    .description('check a file against a suit')
    .option('-s --suit <suit>', 'specify suit') // currently not working
    .action(function(file, options) {

        var fullFilePath,
            getRelativePath = _.partial(util.fileExistPromise, process.cwd());

        // domain logic
        getRelativePath(file).then(function(filepath) {
            if (filepath === false) {
                throw new Error('File does not exist.');
            }
            fullFilePath = filepath;
            return SuitManager.getSuit(options.suit);
        }).then(function(suit) {
            runSuit(fullFilePath, suit);
        }).catch(function(err) {
            console.log(err);
        });
    });

program.command('describe')
    .description('describe a suit, if it has a description.txt file.')
    .action(function() {
        SuitManager.getSuit().then(function(suit) {
            describeSuit(suit);
        });
    });

program.parse(process.argv);
