/**
 * Mixer view that contains the channel plugin views.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createMixerView(specs) {

        // private variables
        var that,
            rootEl = $('.channels'),
            pluginViews = [],
            
            init = function() {
                
            },

            /**
             * Fill a mixer channel with mixer channel controls.
             * This happens once because the mixer is created only once.
             * @param {Object} channelPlugin Plugin Processor object.
             * @param {Number} index Channel index in which to create the channel controls.
             */
            setChannel = function(channelPlugin, index) {
                var pluginView = WH.createPluginView({
                    plugin: channelPlugin,
                    parentEl: rootEl,
                    index: index
                });
                
                pluginViews[channelPlugin.getId()] = pluginView;
            };
    
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        that.setChannel = setChannel;
        return that;
    }

    WH.createMixerView = createMixerView;
    
})(WH);
