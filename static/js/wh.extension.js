// AudioNode and AudioParam injection taken from Hongchan Choi's WAAX library.
// Wouter Hisschemöller, 2016

// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

/**
 * Injects into window.AudioNode
 * @namespace AudioNode
 */

/**
 * Connects a WA node to the other WA nodes. Note that this method is
 *   injected to AudioNode.prototype. Supports multiple outgoing
 *   connections. (fanning out) Returns the first WA node to enable method
 *   chaining.
 * @memberOf AudioNode
 * @param {...AudioNode} nodes WA nodes.
 * @return {AudioNode} The first target WA node.
 */
AudioNode.prototype.to = function () {
    for (var i = 0; i < arguments.length; i++) {
        this.connect(arguments[i]);
    }
    return arguments[0];
};

/**
 * Disconnects outgoing connection of a WA node. Note that this method is
 *   injected to AudioNode.prototype.
 * @memberOf AudioNode
 */
AudioNode.prototype.cut = function () {
    this.disconnect();
};

/**
 * Injects into window.AudioParam
 * @namespace AudioParam
 */

/**
 * Equivalent of AudioParam.cancelScheduledValues. Cancels scheduled value
 *   after a given starting time.
 * @memberOf AudioParam
 * @method
 * @see  http://www.w3.org/TR/webaudio/#dfn-cancelScheduledValues
 */
AudioParam.prototype.cancel = AudioParam.prototype.cancelScheduledValues;

/**
 * Manipulates AudioParam dynamically.
 * @memberOf AudioParam
 * @param {Number} value Target parameter value
 * @param {Number|Array} time Automation start time. With rampType 3, this
 *   argument must be an array specifying [start time, time constant].
 * @param {Number} rampType Automation ramp type. 0 = step, 1 = linear,
 *   2 = exponential, 3 = target value [start, time constant].
 * @see  http://www.w3.org/TR/webaudio/#methodsandparams-AudioParam-section
 */
AudioParam.prototype.set = function (value, now, time, rampType) {
    switch (rampType) {
        case 0:
        case undefined:
            time = (time < now) ? now : time;
            this.setValueAtTime(value, time);
            // TO FIX: when node is not connected, automation will not work
            // this hack handles the error
            if (time <= now && value !== this.value) {
                this.value = value;
            }
            break;
        case 1:
            time = (time < now) ? now : time;
            this.linearRampToValueAtTime(value, time);
            break;
        case 2:
            time = (time < now) ? now : time;
            value = value <= 0.0 ? 0.00001 : value;
            this.exponentialRampToValueAtTime(value, time);
            break;
        case 3:
            time[0] = (time[0] < now) ? now : time[0];
            value = value <= 0.0 ? 0.00001 : value;
            this.setTargetAtTime(value, time[0], time[1]);
            break;
    }
};

/**
 * Object.assign polyfill.
 * Used by Safari iOS v7.
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}
