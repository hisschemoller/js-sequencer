/**
 *  Studio contains the sound generating instruments.
 *  One instrument for each channel.
 *  Studio receives Step objects that trigger the instruments.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH, WX) {

    /**
     * @constructor
     */
    function Studio() {

            /**
             * Channel plugins that form a mixer.
             * @type {Array}
             */
        var channels = [],

            /**
             * Plugin instruments used by the current project.
             * @type {Array}
             */
            instruments = [],

            /**
             * Solo parameter was changed on one of the channel plugins.
             * @param {Number} pluginId ID of the channel plugin that changed its solo parameter.
             * @param {Boolean} isSolo Value of the channel's solo parameter.
             */
            onSoloChange = function(pluginId, isSolo) {

                var i = 0,
                    n = channels.length,
                    isAnySoloActive = false;

                // test if any of the channels is soloed
                for (i; i < n; i++) {
                    isAnySoloActive = isAnySoloActive || channels[i].get('solo');
                }

                for (i = 0; i < n; i++) {
                    channels[i].onExternalSolo(pluginId, isSolo, isAnySoloActive);
                }
            };

        /**
         * Initialisation.
         */
        this.setup = function() {
            for (var i = 0; i < WH.Conf.getTrackCount(); i++) {
                var channel = WX.Channel();
                channel.setSoloCallback(onSoloChange);
                channel.to(WX.Master);
                channels.push(channel);
                WH.View.setChannel(channel, i);
            }

            WH.View.setSelectedChannel(channels[0].getId());
        };

        /**
         * Add instuments and connect them to the output.
         * @param {Array} data Studio setup data.
         */
        this.setData = function(data) {
            var rack,
                instrument,
                channel,
                i = 0,
                n = data.length,
                generators = WX.PlugIn.getRegistered('Generator'),
                j = 0,
                p = generators.length,
                param,
                soloedChannel;

            for (i; i < n; i++) {

                rack = data[i];
                channel = channels[i];

                for (j = 0; j < p; j++) {
                    if (generators[j] == rack.instrument.name) {
                        instrument = WX[rack.instrument.name]();

                        // update plugin parameters if they exist.
                        for (param in rack.instrument.preset) {
                            instrument.set(param, rack.instrument.preset[param]);
                        }
                        break;
                    }
                }

                if (instrument) {
                    instrument.to(channel);
                    instruments.push(instrument);
                    WH.View.setInstrument(instrument, i);
                }

                channel.setPreset(rack.channel.preset);

                // if there's channels soloed, remember one of them
                if (channel.get('solo')) {
                    soloedChannel = channel;
                }

                WH.View.setPluginPreset(channel.getId(), channel.getPresetValues());
            }

            // if there's soloed channels set the solo after all presets are set
            if (soloedChannel) {
                onSoloChange(soloedChannel.getId(), true);
            }
        };

        /**
         * get all settings that should be saved with a project
         * @return {Array} Array of objects with all data per channel and rack.
         */
        this.getData = function() {
            var racks = [],
                i = 0,
                n = channels.length,
                rack;

            for (i; i < n; i++) {

                rack = {
                    instrument: {
                        name: instruments[i].info.className,
                        preset: instruments[i].getPreset()
                    },
                    channel: {
                        preset: channels[i].getPreset()
                    }
                };
                racks.push(rack);
            }

            return racks;
        };

        /**
         * Add instuments and connect them to the output.
         * @param {Array} playbackQueue Array to collect Steps.
         */
        this.playEvents = function(playbackQueue) {
            var step,
                instrument;
            for (var i = 0; i < playbackQueue.length; i++) {
                step = playbackQueue[i];
                if (step.velocity > 0) {
                    instrument = instruments[step.channel];
                    instrument.noteOn(step.pitch, step.velocity, step.absStart);
                    instrument.noteOff(step.pitch, step.absEnd);
                }
            }
        };

        /**
         * Set the value of a parameters of one of the plugins.
         * Typically after a user interacted with the UI.
         * @param {Number} pluginId Unique ID of the plugin.
         * @param {String} paramKey The parameter to change.
         * @param {number|boolean} paramValue The new value for the parameter.
         * paramValue for a Boolean parameter is a Boolean.,
         * paramValue for a Generic parameter is a normalized value between 0 and 1,
         * paramValue for an Itemized parameter is the index number of the selected item.
         */
        this.setParameter = function(pluginId, paramKey, paramValue) {
            var i = 0,
                n,
                plugin;

            // is it a generator?
            n = instruments.length;
            for (i; i < n; i++) {
                if (pluginId == instruments[i].getId()) {
                    plugin = instruments[i];
                    break;
                }
            }

            // is it a channel?
            if (!plugin) {
                i = 0;
                n = channels.length;
                for (i; i < n; i++) {
                    if (pluginId == channels[i].getId()) {
                        plugin = channels[i];
                        break;
                    }
                }
            }

            if (plugin) {
                plugin.setParameter(paramKey, paramValue);
                WH.View.updatePluginControl(pluginId, paramKey, plugin.getParameterValues(paramKey));
            }
        }
    }

    Studio.prototype = {};

    /**
     * Singleton
     */
    WH.Studio = new Studio();
})(WH, WX);
