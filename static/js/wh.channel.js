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
            pan: {
                type: 'Generic',
                name: 'Pan',
                default: 0.0,
                min: -1.0,
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
            pan: 0.0
        },

        $pan: function(value, time, rampType) {
            this._panner.setPosition(value, 0, 0.5);
        }
    };

    WX.PlugIn.extendPrototype(Channel, 'Processor');
    WX.PlugIn.register(Channel);

})(WX);