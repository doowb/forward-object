/*!
 * forward-object <https://github.com/doowb/forward-object>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var define = require('define-property');

/**
 * Returns a function for copying properties from an object
 * to another object.
 *
 * ```js
 * var forward = require('forward-object')({omit: ['foo']});
 * ```
 *
 * @param {Object} `options`
 * @param {Boolean} `options.enumerable` Make copied properties enumerable. `true` is the default.
 * @param {Array|String} `options.keys` Limit forwarding to the specified keys.
 * @param {Array|String} `options.omit` Exclude the specified keys from being copied.
 * @api public
 */

module.exports = function(options) {
  options = options || {};
  var keys = options.keys;
  var omit = options.omit || [];

  /**
   * Copy properties from the `provider` object to the `receiver`.
   *
   * Properties with function values will be invoked in the context
   * of the provider, and properties with non-function values are
   * just copied.
   *
   * @name forward
   * @param {Object} `receiver`
   * @param {Object} `provider`
   * @return {Object} Receiver with forwarded properties from provider.
   * @api public
   */

  return function forwardObject(receiver, provider) {
    keys = keys ? arrayify(keys) : objectKeys(provider, omit);

    keys.forEach(function (key) {
      if (options.enumerable === false) {
        defineProps(receiver, provider, key);
      } else {
        copy(receiver, provider, key);
      }
    });
    return receiver;
  }
}

/**
 * Get keys from `object`, including keys
 * inherited through the prototype chain
 *
 * @param  {Object} `obj` Object to get keys from
 * @return {Array} Array of keys
 */

function objectKeys (obj, omit) {
  var keys = [];
  for (var key in obj) {
    if (~omit.indexOf(key)) continue;
    keys.push(key);
  }
  return keys;
}

/**
 * Cast `val` to an array.
 */

function arrayify (val) {
  return Array.isArray(val) ? val : [val];
}

/**
 * Copy properties from object `b` to object `a` and
 * make them non-enumerable.
 */

function defineProps(a, b, key) {
  var val = b[key];
  if (typeof val === 'function') {
    define(a, key, function () {
      return val.apply(b, arguments);
    });
  } else {
    define(a, key, val);
  }
}

/**
 * Copy properties from object `b` to object `a` and
 * make them enumerable.
 */

function copy(a, b, key) {
  var val = b[key];
  if (typeof val === 'function') {
    a[key] = function () {
      return val.apply(b, arguments);
    };
  } else {
    a[key] = val;
  }
}
