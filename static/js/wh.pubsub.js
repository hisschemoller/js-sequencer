/**
 * Mixer view that contains the channel plugin views.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createPubSub(specs) {
        var that = specs.that,
            subscriptions = {},
            
            on = function(event, callback) {
                subscriptions[event] = callback;
            },
            
            off = function(event, callback) {
                delete subscriptions[event];
            },
            
            trigger = function(event, data) {
                if (subscriptions[event]) {
                    subscriptions[event](data);
                }
            };
        
        that.on = on;
        that.off = off;
        that.trigger = trigger;
        return that;
    }

    WH.createPubSub = createPubSub;

})(WH);
