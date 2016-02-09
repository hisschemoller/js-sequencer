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

        // call prototype's constructor
        // @see http://www.bennadel.com/blog/1566-using-super-constructors-is-critical-in-prototypal-inheritance-in-javascript.htm
        WH.PlugIn.call(this);

        // plugin audio nodes
        this._panner = WX.Panner();
        this._soloMute = WX.Gain();
        this._input.to(this._soloMute).to(this._panner).to(this._output);

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

        this.addEditableParams([{
                key: 'mute',
                shortname: 'M'
            }, {
                key: 'solo',
                shortname: 'S'
            }, {
                key: 'pan',
                shortname: 'Pan'
            }, {
                key: 'level',
                shortname: 'Lvl'
            }]);
    }

    Channel.prototype = WH.PlugIn;
    Channel.prototype.constructor = Channel;

    Channel.prototype.info = {
        name: 'Channel',
        api_version: '1.0.0-alpha',
        plugin_version: '1.0.0',
        author: 'Wouter Hisschemöller',
        type: 'Processor',
        description: 'A mixer channel with gain, pan'
    };

    Channel.prototype.defaultPreset = {
        mute: false,
        solo: false,
        pan: 0.0,
        level: 1.0
    };

    Channel.prototype.$mute = function(value, time, rampType) {
        this._soloMute.gain.value = value ? 0.0 : 1.0;
    };

    Channel.prototype.$solo = function(value, time, rampType) {
        // this._soloMute
    };

    Channel.prototype.$pan = function(value, time, rampType) {
        this._panner.setPosition(value, 0, 0.5);
    };

    WX.PlugIn.extendPrototype(Channel, 'Processor');
    WX.PlugIn.register(Channel);

})(WX);