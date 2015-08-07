/*!
 * forward-object <https://github.com/doowb/forward-object>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';


/**
 * Copy properties from an object to another object,
 * where properties with function values will be
 * invoked in the context of the provider, and properties
 * with non-function values are just copied.
 *
 * ```js
 * var receiver = {};
 * var provider = {
 *   name: 'provider',
 *   upper: function (str) {
 *     return '[' + this.name + '] ' + str.toUpperCase();
 *   }
 * };
 * var receiver = forward(receiver, provider);
 * receiver.name = 'receiver';
 * console.log(receiver.upper('foo'));
 * //=> [provider] FOO
 * ```
 *
 * @param  {Object} `receiver` Object to receive properties.
 * @param  {Object} `provider` Object providing properties.
 * @param  {Array} `keys` Optional array of keys to foward.
 * @return {Object} Modified `receiver` object with properties from `provider`
 * @api public
 */

function forward(receiver, provider, keys) {
  keys = keys || Object.keys(provider);
  keys = Array.isArray(keys) ? keys : [keys];

  keys.forEach(function (key) {
    var val = provider[key];

    if (typeof val === 'function') {
      receiver[key] = function () {
        return provider[key].apply(provider, arguments);
      };
    } else {
      receiver[key] = val;
    }
  });
  return receiver;
}

/**
 * Export `forward` function
 */

module.exports = forward;
