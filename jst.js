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
    var fullpath = path.resolve(__dirname, filepath);
    var defer = Q.defer();
    fs.exists(fullpath, function(exist) {
        if (exist) {
            defer.resolve(fullpath);
        } else {
            defer.reject(new Error('file does not exist'));
        }
    });
    return defer.promise;
};

var getSuit = function(suit) {
    return getSuitName().then(function(data) {
        return data.suitName;
    });
};

program.command('check <file>')
    .description('check a file against a suit')
    .option('-s --suit <suit>', 'specify suit')
    .action(function(file, options) {
        Q.all([getFileRealPath(file), getSuit(options.suit)]).spread(function(file, suit) {
            console.log(file, suit);
        }).done();

        //var content = fs.readFileSync(__dirname + '/' + options, 'utf8');
        //fs.writeFileSync(__dirname + '/suit/capitalize/check.js', content);
        //var child = require('child_process').exec('nodeunit suit/capitalize/test/', function(stdin, stdout) {
        //    console.log(stdout);
        //    fs.unlinkSync(__dirname + '/suit/capitalize/check.js');
        //});
    });

program.parse(process.argv);
