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
    function createStudio(specs) {
        
        var that = specs.that,
            channelSelectView = specs.channelSelectView,
            conf = specs.conf,
            core = specs.core,
            mixerView = specs.mixerView,
            rackView = specs.rackView,
            pluginManager = specs.pluginManager,
            view = specs.view,
            
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
                    n = conf.getTrackCount(),
                    channel;

                instruments = new Array(n);

                for (i; i < n; i++) {
                    var channel = pluginManager.createPlugin('channel');
                    channel.setSoloCallback(onSoloChange);
                    channel.to(core.getMainOut());
                    channels.push(channel);
                    mixerView.setPlugin(channel, i);
                }

                channelSelectView.setSelectedChannel(channels[0].getId());
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
                    trackCount = conf.getTrackCount(),
                    param,
                    paramKey,
                    soloedChannel,
                    pluginId,
                    preset;

                for (i; i < trackCount; i++) {

                    // remove the old instrument, if it exists
                    if (instruments[i]) {
                        clearInstrument(instruments[i], i);
                    }

                    rackData = data[i];
                    channel = channels[i];

                    // add the instrument
                    if (rackData && rackData.instrument && rackData.instrument.name) {
                        instrument = pluginManager.createPlugin(rackData.instrument.name);
                        if (instrument) {
                            instrument.setPreset(rackData.instrument.preset);
                            instrument.to(channel);
                            instruments[i] = instrument;
                            rackView.setPlugin(instrument, i);
                        }
                    }
                    
                    channel.setPreset(Object.assign({}, channel.defaultPreset, rackData.channel.preset));

                    // if there's channels soloed, remember one of them
                    if (channel.getParamValue('solo')) {
                        soloedChannel = channel;
                    }
                    
                    preset = channel.getPreset();
                    pluginId = channel.getId();
                    for (paramKey in preset) {
                        view.updatePluginControl(pluginId, paramKey, channel.getParam(paramKey));
                    }
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
             * Remove the instrument from the rack and delete it
             * @param {Object} instrument Plugin Generator object.
             * @param {Number} index Rack index from which to remove the instrument.
             */
            clearInstrument = function(instrument, index) {
                // remove plugin view
                var pluginID = instrument.getId();
                if (pluginID) {
                    pluginViews[pluginID].destroy();
                    delete pluginViews[pluginID];
                }
                // remove plugin
                instrument.cut();
                instrument = null;
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
                    view.updatePluginControl(pluginId, paramKey, plugin.getParam(paramKey));
                }
            };
        
        that.onSoloChange = onSoloChange;
        that.setup = setup;
        that.setData = setData;
        that.getData = getData;
        that.playEvents = playEvents;
        that.setParameter = setParameter;
        return that;
    }
    
    WH.createStudio = createStudio;
})(WH);
