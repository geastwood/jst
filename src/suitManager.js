// Manage suits and suit

var suits = require('./suits');
var suit = require('./suit');
var inquirer = require('inquirer');
var Q = require('q');

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
            return suit.create(suitData);
        }).catch(function(err) {
            throw new Error(err);
        });
    }
};
