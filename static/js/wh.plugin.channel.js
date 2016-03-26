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

        this.isAnySoloActive = false;

        // plugin audio nodes
        this._panner = WX.Panner();
        this._soloMute = WX.Gain();
        this._input.to(this._soloMute).to(this._panner).to(this._output);

        // callback to notify the other channels of a solo parameter change
        this.soloCallback;

        this.isMute = false;

        this.isSolo = false;

        this.level = this._soloMute.gain.value;

        // plugin parameters
        WX.defineParams(this, {

            mute: {
                type: 'Boolean',
                name: 'M',
                default: false
            },

            solo: {
                type: 'Boolean',
                name: 'S',
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
                key: 'mute'
            }, {
                key: 'solo'
            }, {
                key: 'pan'
            }, {
                key: 'level'
            }]);
    }

    Channel.prototype = Object.create(WH.PlugIn);

    Channel.prototype.info = {
        className: 'Channel',
        name: 'Mixer Channel',
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

        this.isMute = value;

        if (value) {
            this._soloMute.gain.value = 0.0;
        } else {
            if (this.isAnySoloActive) {
                if (this.isSolo) {
                    this._soloMute.gain.value = 1.0;
                } else {
                    this._soloMute.gain.value = 0.0;
                }
            } else {
                this._soloMute.gain.value = 1.0;
            }
        }
    };

    Channel.prototype.$solo = function(value, time, rampType) {

        this.isSolo = value;
        
        // callback to notify the other channels of the change
        if (this.soloCallback) {
            this.soloCallback(this.getId(), this.isSolo);
        }
    };

    Channel.prototype.$pan = function(value, time, rampType) {
        this._panner.setPosition(value, 0, 0.5);
    };

    Channel.prototype.$level = function(value, time, rampType) {
        this.level = value;
        this._soloMute.gain.value = this.level;
    };

    /**
     * Set the callback function to notify the other channels of a solo parameter change.
     * @param {Function} callback The callback function.
     */
    Channel.prototype.setSoloCallback = function(callback) {
        this.soloCallback = callback;
    };

    /**
     * Solo parameter on one of the other channels was changed.
     * @param  {Number} pluginId ID of the plugin that changed its solo parameter.
     * @param  {Boolean} isSolo Value of the other channel's solo parameter.
     */
    Channel.prototype.onExternalSolo = function(pluginId, isSolo, isAnySoloActive) {

        this.isAnySoloActive = isAnySoloActive;
        
        if (this.isMute) {
            this._soloMute.gain.value = 0.0;
            return;
        }

        if (pluginId == this.getId()) {
            if (isSolo) {
                this._soloMute.gain.value = this.level;
            } else {
                if (isAnySoloActive) {
                    this._soloMute.gain.value = 0.0;
                } else {
                    this._soloMute.gain.value = this.level;
                }
            }
        } else {
            if (this.isSolo) {
                this._soloMute.gain.value = this.level;
            } else {
                if (isAnySoloActive) {
                    this._soloMute.gain.value = 0.0;
                } else {
                    this._soloMute.gain.value = this.level;
                }
            }
        }
    };

    WX.PlugIn.extendPrototype(Channel, 'Processor');
    WX.PlugIn.register(Channel);

})(WX);