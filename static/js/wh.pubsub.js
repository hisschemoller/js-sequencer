/**
 * Publish subscribe pattern.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createPubSub(specs) {
        var that = specs.that,
            subscriptions = {},
            
            on = function(event, callback) {
                if (!subscriptions[event]) {
                    subscriptions[event] = [];
                }
                subscriptions[event].push(callback);
            },
            
            off = function(event, callback) {
                if (subscriptions[event]) {
                    var n = subscriptions[event].length;
                    while (--n > -1) {
                        if (subscriptions[event][n] === callback) {
                            subscriptions[event].splice(n, 1);
                        }
                    }
                }
            },
            
            trigger = function(event, data) {
                if (subscriptions[event]) {
                    var n = subscriptions[event].length;
                    while (--n > -1) {
                        subscriptions[event][n](data);
                    }
                }
            };
        
        that.on = on;
        that.off = off;
        that.trigger = trigger;
        return that;
    }

    WH.createPubSub = createPubSub;

})(WH);
