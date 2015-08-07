'use strict';

var assert = require('assert');
var forward = require('./');

describe('foward-object', function () {
  it('should foward all properties', function () {
    var receiver = {};
    var provider = {
      name: 'provider',
      upper: function (str) {
        return '[' + this.name + '] ' + str.toUpperCase();
      }
    };
    var receiver = forward(receiver, provider);
    assert.deepEqual(Object.keys(receiver), Object.keys(provider));
  });

  it('should foward specified properties', function () {
    var receiver = {};
    var provider = {
      name: 'provider',
      foo: 'bar',
      upper: function (str) {
        return '[' + this.name + '] ' + str.toUpperCase();
      }
    };
    var receiver = forward(receiver, provider, ['name', 'upper']);
    assert.deepEqual(Object.keys(receiver), ['name', 'upper']);
  });

  it('should execute methods with the context of the provider', function () {
    var receiver = {};
    var provider = {
      name: 'provider',
      upper: function (str) {
        return '[' + this.name + '] ' + str.toUpperCase();
      }
    };
    var receiver = forward(receiver, provider, ['name', 'upper']);
    receiver.name = 'receiver',
    assert.deepEqual(receiver.name, 'receiver');
    assert.deepEqual(provider.name, 'provider');
    assert.deepEqual(receiver.upper('foo'), '[provider] FOO');
  });
});
