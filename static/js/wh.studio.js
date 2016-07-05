/**
 *  Studio contains the sound generating instruments.
 *  One instrument for each channel.
 *  Studio receives Step objects that trigger the instruments.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function createStudio() {
        
        var that,
            
            /**
             * Channel plugins that form a mixer.
             * @type {Array}
             */
            channels = [],

            /**
             * Plugin instruments used by the current project.
             * @type {Array}
             */
            instruments,

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
                    isAnySoloActive = isAnySoloActive || channels[i].getParamValue('solo');
                }

                for (i = 0; i < n; i++) {
                    channels[i].onExternalSolo(pluginId, isSolo, isAnySoloActive);
                }
            },

            /**
             * Initialisation.
             */
            setup = function() {
                var i = 0,
                    n = WH.conf.getTrackCount(),
                    channel;

                instruments = new Array(n);

                for (i; i < n; i++) {
                    var channel = WH.pluginManager.createPlugin('channel');
                    channel.setSoloCallback(onSoloChange);
                    channel.to(WH.core.getMainOut());
                    channels.push(channel);
                    WH.View.setChannel(channel, i);
                }

                WH.View.setSelectedChannel(channels[0].getId());
            },

            /**
             * Add instuments and connect them to the output.
             * @param {Array} data Studio setup data.
             */
            setData = function(data) {
                var rack,
                    instrument,
                    channel,
                    i = 0,
                    trackCount = WH.conf.getTrackCount(),
                    param,
                    soloedChannel;

                    for (i; i < trackCount; i++) {

                    // remove the old instrument, if it exists
                    if (instruments[i]) {
                        WH.View.clearInstrument(instruments[i], i);
                        instruments[i].cut();
                        instruments[i] = null;
                    }

                    rackData = data[i];
                    channel = channels[i];

                    // add the instrument
                    if (rackData.instrument && rackData.instrument.name) {
                        instrument = WH.pluginManager.createPlugin(rackData.instrument.name);
                        if (instrument) {
                            instrument.setPreset(rackData.instrument.preset);
                            instrument.to(channel);
                            instruments[i] = instrument;
                            WH.View.setInstrument(instrument, i);
                        }
                    }

                    channel.setPreset(Object.assign({}, channel.defaultPreset, rackData.channel.preset));

                    // if there's channels soloed, remember one of them
                    if (channel.getParamValue('solo')) {
                        soloedChannel = channel;
                    }

                    WH.View.setPluginPreset(channel.getId(), channel.getPreset());
                }

                // if there's soloed channels set the solo after all presets are set
                if (soloedChannel) {
                    onSoloChange(soloedChannel.getId(), true);
                }
            },

            /**
             * get all settings that should be saved with a project
             * @return {Array} Array of objects with all data per channel and rack.
             */
            getData = function() {
                var racks = [],
                    i = 0,
                    n = channels.length,
                    rack;

                for (i; i < n; i++) {
                    rack = {
                        instrument: instruments[i] ? instruments[i].getData() : null,
                        channel: channels[i].getData()
                    };
                    racks.push(rack);
                }

                return racks;
            },

            /**
             * Add instuments and connect them to the output.
             * @param {Array} playbackQueue Array to collect Steps.
             */
            playEvents = function(playbackQueue) {
                var step,
                    instrument;
                for (var i = 0; i < playbackQueue.length; i++) {
                    step = playbackQueue[i];
                    if (step.getVelocity() > 0) {
                        instrument = instruments[step.getChannel()];
                        instrument.noteOn(step.getPitch(), step.getVelocity(), step.getAbsStart());
                        instrument.noteOff(step.getPitch(), step.getAbsEnd());
                    }
                }
            },

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
            setParameter = function(pluginId, paramKey, paramValue) {
                var i = 0,
                    n,
                    plugin;

                // is it a generator?
                n = instruments.length;
                for (i; i < n; i++) {
                    if (instruments[i] && pluginId == instruments[i].getId()) {
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
                    plugin.setParamValue(paramKey, paramValue);
                    WH.View.updatePluginControl(pluginId, paramKey, plugin.getParam(paramKey));
                }
            };
        
        that = {};
        that.onSoloChange = onSoloChange;
        that.setup = setup;
        that.setData = setData;
        that.getData = getData;
        that.playEvents = playEvents;
        that.setParameter = setParameter;
        return that;
    }

    /**
     * Singleton
     */
    WH.studio = createStudio();
})(WH);
