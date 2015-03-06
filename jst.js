#!/usr/bin/env node

var SuitManager = require('./src/suitManager');
var program = require('commander');
var _ = require('lodash');
var util = require('./src/util');
var library = require('./src/library');

/**
 * read js content from `filepath` and run against test folder, output the result
 * @param {String} filepath
 * @param {src/suit} suit suit Object
 */
var runSuit = function(filepath, suit) {
    var fs = require('fs'),
        tmp = require('os').tmpDir(),
        tmpFolder = String(Date.now()),
        path = require('path'),
        wrench = require('wrench'),
        targetPath = path.join(tmp, tmpFolder),
        content;

    // content of the source file
    content = fs.readFileSync(filepath, 'utf8');

    // append `lodash` to source file
    content = 'var _ = require(\'./vendor/lodash\');' + '\n' + content;

    // copy whole suit folder to temp folder to run
    wrench.copyDirSyncRecursive(path.join(__dirname, 'suit', suit.getPath()), targetPath);
    fs.writeFileSync(path.join(targetPath, 'check.js'), content);

    // add the library
    library.add(targetPath);

    require('child_process').exec('nodeunit ' + path.join(targetPath, 'test'), function(stdin, stdout) {
        console.log(stdout);

        // remove temp folder
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
            util.print('No description for this test suit');
        } else {
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) {
                    throw err;
                }
                util.print(data);
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
                util.print('File does not exist.', 'error');
            }
            fullFilePath = filepath;
            return SuitManager.getSuit(options.suit);
        }).then(function(suit) {
            runSuit(fullFilePath, suit);
        }).catch(function(err) {
            util.print(String(err), 'error');
        });
    });

program.command('describe')
    .description('describe a suit, if it has a description.txt file.')
    .action(function() {
        SuitManager.getSuit().then(function(suit) {
            describeSuit(suit);
        });
    });

// TODO
program.command('develop')
    .description('develop a suit, produce a src file that fulfills all test cases')
    .action(function() {
        SuitManager.getSuit().then(function(suit) {
            // start watching
            var fs = require('fs');
            var path = require('path');
            var srcFile = path.join(__dirname, 'suit', suit.getPath(), 'src.js');
            console.log(srcFile);
            var exec = require('child_process').exec;
            console.log('Start watching:', srcFile);
            fs.watchFile(srcFile, function() {
                var targetPath = path.join(__dirname, 'suit', suit.getPath(), 'check.js');
                var srcContent = fs.readFileSync(srcFile, 'utf8'); // every time read fresh content
                fs.writeFileSync(targetPath, srcContent, 'utf8');
                exec('nodeunit ' + path.join(__dirname, 'suit', suit.getPath(), 'test'), function(stdin, stdout) {
                    console.log(stdout);
                    fs.unlinkSync(targetPath);
                });
            });
        });
    });

program.parse(process.argv);
