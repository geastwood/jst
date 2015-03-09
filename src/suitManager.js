// Manage suits and suit

var suits = require('./suits');
var suit = require('./suit');
var inquirer = require('inquirer');
var Q = require('q');
var path = require('path');
var util = require('./util');

module.exports = {
    getSuitName: function() {
        var defer = Q.defer();
        inquirer.prompt([{
                name: 'suitName',
                type: 'list',
                message: 'Select a suit name',
                choices: suits.getSuitNames()
            }],
            function(answers) {
                defer.resolve(answers);
            });
        return defer.promise;
    },
    getSuit: function() {
        return this.getSuitName().then(function(data) {
            return data.suitName;
        }).then(suits.getByName).then(function(suitData) {
            return suit.tap(suitData);
        }).catch(function(err) {
            throw new Error(err);
        });
    },
    newSuit: function() {
        var defer = Q.defer();
        inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Provide a suit name'
        }, {
            name: 'description',
            type: 'input',
            message: 'Provide a short description'
        }], function(answers) {
            defer.resolve(answers)
        });
        return defer.promise;
    },

    createSuit: function() {
        // name and description
        // basic check of suit existence
        return this.newSuit().then(function(suitData) {
            return suit.create(path.join(__dirname, '../suit'), suitData);
        }).then(function(def) {
            return suits.add(def);
        }).catch(function(err) {
            console.log(err);
        }).then(function(rst) {
            util.print(rst);
        }).catch(function(err) {
            throw new Error(err);
        });
    }
};
