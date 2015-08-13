'use strict';

/* deps: mocha */
var assert = require('assert');
var makeEnumerable = require('make-enumerable');
var forward = require('./');


describe('foward-object', function () {
  it('should foward all properties', function () {
    var copy = forward();
    var receiver = {};
    var provider = {
      name: 'provider',
      upper: function (str) {
        return '[' + this.name + '] ' + str.toUpperCase();
      }
    };
    copy(receiver, provider);
    assert.deepEqual(Object.keys(receiver), Object.keys(provider));
  });

  it('should make copied properties non-enumerable', function () {
    var copy = forward({enumerable: false});
    var a = {};
    var b = {one: 'aaa', two: 'bbb', three: 'ccc'};
    copy(a, b);

    var foo = makeEnumerable(a);

    assert.deepEqual(Object.keys(a), []);
    assert.deepEqual(Object.keys(a), []);
    assert.equal(a.one, 'aaa');
    assert.equal(a.two, 'bbb');
    assert.equal(a.three, 'ccc');
    assert.deepEqual(foo, b);
  });

  it('should return the receiver object', function () {
    var copy = forward();
    var a = {};
    var b = {one: 'aaa', two: 'bbb', three: 'ccc'};
    var result = copy(a, b);
    assert.deepEqual(Object.keys(result), ['one', 'two', 'three']);
  });

  it('should update the receiver object', function () {
    var copy = forward();
    var a = {};
    var b = {one: 'aaa', two: 'bbb', three: 'ccc'};
    copy(a, b);
    assert.deepEqual(Object.keys(a), ['one', 'two', 'three']);
  });

  it('should omit properties defined on `options.omit`', function () {
    var copy = forward({enumerable: true, omit: 'three'});
    var a = {};
    var b = {one: 'aaa', two: 'bbb', three: 'ccc'};
    copy(a, b);
    assert.deepEqual(Object.keys(a), ['one', 'two']);
  });

  it('should foward specified properties', function () {
    var copy = forward({enumerable: true, keys: ['name', 'upper']});
    var receiver = {};
    var provider = {
      name: 'provider',
      foo: 'bar',
      upper: function (str) {
        return '[' + this.name + '] ' + str.toUpperCase();
      }
    };
    copy(receiver, provider);
    assert.deepEqual(Object.keys(receiver), ['name', 'upper']);
  });

  it('should execute methods with the context of the provider', function () {
    var copy = forward({enumerable: true, keys: ['name', 'upper']});
    var receiver = {};
    var provider = {
      name: 'provider',
      upper: function (str) {
        return '[' + this.name + '] ' + str.toUpperCase();
      }
    };
    copy(receiver, provider);
    receiver.name = 'receiver',
    assert.deepEqual(receiver.name, 'receiver');
    assert.deepEqual(provider.name, 'provider');
    assert.deepEqual(receiver.upper('foo'), '[provider] FOO');
  });
});
