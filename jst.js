#!/usr/bin/env node

var inquirer = require('inquirer');
var Suit = require('./src/suit');
var Q = require('q');
var program = require('commander');

var getSuitName = function() {
    var defer = Q.defer();
    inquirer.prompt([{
        name: 'suitName',
        type: 'list',
        message: 'Select a suit name',
        choices: Suit.getSuitNames()
    }],
    function(answers) {
        defer.resolve(answers);
    });
    return defer.promise;
};

var getFileRealPath = function(filepath) {
    var fs = require('fs');
    var path = require('path');
    var fullpath = path.resolve(process.cwd(), filepath);
    var defer = Q.defer();
    fs.exists(fullpath, function(exist) {
        if (exist) {
            defer.resolve(fullpath);
        } else {
            defer.resolve(false);
        }
    });
    return defer.promise;
};

var getSuit = function(suit) {
    return getSuitName().then(function(data) {
        return data.suitName;
    }).then(function(suitName) {
        return Suit.getDefinition(suitName);
    });
};

// TODO
var addLib = function(folder) {
    var wrench = require('wrench'), path = require('path'), fs = require('fs');
    wrench.mkdirSyncRecursive(path.join(folder, 'vendor'));
    var lodash = fs.readFileSync(path.join(__dirname, 'node_modules', 'lodash', 'index.js'), 'utf8');
    fs.writeFileSync(path.join(folder, 'vendor', 'lodash.js'), lodash);
};

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
    wrench.copyDirSyncRecursive(path.join(__dirname, 'suit', suit), targetPath);
    fs.writeFileSync(path.join(targetPath, 'check.js'), content);

    addLib(targetPath);

    require('child_process').exec('nodeunit ' + path.join(targetPath, 'test'), function(stdin, stdout) {
        console.log(stdout);
        wrench.rmdirSyncRecursive(targetPath);
    });
};

program.command('check <file>')
    .description('check a file against a suit')
    .option('-s --suit <suit>', 'specify suit')
    .action(function(file, options) {

        var fullFilePath;

        // domain logic
        getFileRealPath(file).then(function(filepath) {
            if (filepath === false) {
                console.log('fei');
                throw new Error('File does not exist.');
            }
            fullFilePath = filepath;
            return getSuit(options.suit);
        }).then(function(suit) {
            runSuit(fullFilePath, suit);
        }).catch(function(err) {
            console.log(err);
        });
    });

program.parse(process.argv);
