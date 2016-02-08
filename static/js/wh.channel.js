/**
 * @description Mixer channel plugin.
 * @author Wouter Hisschemöller
 */
(function(WX) {

    /**
     * @constructor
     * @name Channel
     * @param {Object} preset Parameter preset.
     */
    function Channel(preset) {
        WX.PlugIn.defineType(this, 'Processor');

        // plugin audio nodes
        this._panner = WX.Panner();
        this._input.to(this._panner).to(this._output);

        // plugin parameters
        WX.defineParams(this, {

            mute: {
                type: 'Boolean',
                name: 'Mute',
                default: false
            },

            solo: {
                type: 'Boolean',
                name: 'Solo',
                default: false
            },

            pan: {
                type: 'Generic',
                name: 'Pan',
                default: 0.0,
                min: -1.0,
                max: 1.0
            },

            level: {
                type: 'Generic',
                name: 'Level',
                default: 1.0,
                min: 0.0,
                max: 1.0
            }
        });

        WX.PlugIn.initPreset(this, preset);
    }

    Channel.prototype = {

        info: {
            name: 'Channel',
            api_version: '1.0.0-alpha',
            plugin_version: '1.0.0',
            author: 'Wouter Hisschemöller',
            type: 'Processor',
            description: 'A mixer channel with gain, pan'
        },

        defaultPreset: {
            mute: false,
            solo: false,
            pan: 0.0,
            level: 1.0
        },

        $mute: function(value, time, rampType) {
            
        },

        $pan: function(value, time, rampType) {
            this._panner.setPosition(value, 0, 0.5);
        }, 

        /**
         * Parameters that should be shown in the view.
         * @type {Array}
         */
        visibleParams: ['solo', 'mute', 'pan', 'level'],

        /**
         * [getIsVisibleParameter description]
         * @param  {String} paramKey Key of the parameter to test.
         * @return {Boolean} True if the parameter should be rendered on screen.
         */
        getIsVisibleParameter: function(paramKey) {
            return $.inArray(paramKey, this.visibleParams) >= 0;
        }
    };

    WX.PlugIn.extendPrototype(Channel, 'Processor');
    WX.PlugIn.register(Channel);

})(WX);