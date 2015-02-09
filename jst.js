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

// getSuitName().then(function(data) {
//     console.log('fei', data);
// });

var fs = require('fs');

program.command('check')
    .option('-f --file', 'specify file')
    .action(function(options) {
        var content = fs.readFileSync(__dirname + '/' + options, 'utf8');
        fs.writeFileSync(__dirname + '/suit/capitalize/check.js', content);
        var child = require('child_process').exec('nodeunit suit/capitalize/test/', function(stdin, stdout) {
            console.log(stdout);
            fs.unlinkSync(__dirname + '/suit/capitalize/check.js');
        });
    });

program.parse(process.argv);
