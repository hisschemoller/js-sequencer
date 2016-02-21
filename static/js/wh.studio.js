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
            for (var i = 0; i < WH.Settings.getTrackCount(); i++) {
                var channel = WX.Channel();
                channel.setSoloCallback(onSoloChange);
                channel.to(WX.Master);
                channels.push(channel);
                WH.View.setChannel(channel, i);
            }
        };

        /**
         * Add instuments and connect them to the output.
         * @param {object} data Studio setup data.
         */
        this.setProject = function(data) {
            var instrument,
                i = 0;

            for (i; i < data.length; i++) {

                switch (data[i].instrument.name) {
                    case 'simpleosc':
                        instrument = WX.SimpleOsc(data[i].instrument.preset);
                        break;
                }
                
                if (instrument) {
                    instrument.to(channels[i]);
                    instruments.push(instrument);
                }

                WH.View.setInstrument(instrument, i);

                channels[i].set('pan', data[i].channel.pan);
            }
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
                    instrument.noteOff(step.absEnd);
                }
            }
        };

        /**
         * Set the value of a parameters of one of the plugins.
         * Typically after a user interacted with the UI.
         * @param  {Number} pluginId Unique ID of the plugin.
         * @param  {String} paramKey The parameter to change.
         * @param  {Number, String or Boolean} paramValue The new value for the parameter.
         */
        this.setParameter = function(pluginId, paramKey, paramValue) {
            var i = 0,
                n,
                plugin;

            // is it a generator?
            n = instruments.length;
            for (i; i < n; i++) {
                // if (pluginId == instruments[i].getId()) {
                //     plugin = instruments[i];
                //     break;
                // }
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
                plugin.set(paramKey, paramValue);
                WH.View.updatePluginControl(pluginId, paramKey, plugin.get(paramKey));
            }
        }
    }
    
    Studio.prototype = {};
    
    /** 
     * Singleton
     */
    WH.Studio = new Studio();
})(WH, WX);
