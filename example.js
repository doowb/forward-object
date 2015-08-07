'use strict';

var forward = require('./');

var receiver = {};
var provider = {
  name: 'provider',
  upper: function (str) {
    return '[' + this.name + '] ' + str.toUpperCase();
  }
};
var receiver = forward(receiver, provider);
receiver.name = 'receiver';
console.log(receiver.upper('foo'));
//=> [provider] FOO
